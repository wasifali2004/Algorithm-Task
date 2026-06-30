import {
  BadRequestException,
  ConflictException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { CategorizationService } from '../ai/categorization.service';
import { Prisma } from '../generated/prisma/client';
import { TransactionType, TransferStatus } from '../generated/prisma/enums';
import { PrismaService } from '../prisma/prisma.service';
import { CreateTransferDto } from './dto/create-transfer.dto';
import { TransferEntity } from './entities/transfer.entity';

const transferSelect = {
  id: true,
  idempotencyKey: true,
  fromAccountId: true,
  toAccountId: true,
  amount: true,
  status: true,
  description: true,
  createdAt: true,
  fromAccount: {
    select: {
      id: true,
      userId: true,
      user: { select: { name: true, email: true } },
    },
  },
  toAccount: {
    select: {
      id: true,
      user: { select: { name: true, email: true } },
    },
  },
  transactions: {
    select: {
      id: true,
      accountId: true,
      type: true,
      amount: true,
      description: true,
    },
  },
} as const;

type TransferRecord = Prisma.TransferGetPayload<{
  select: typeof transferSelect;
}>;

type LockedAccount = {
  id: string;
  balance: Prisma.Decimal;
  currency: string;
};

@Injectable()
export class TransfersService {
  private readonly logger = new Logger(TransfersService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly categorization: CategorizationService,
  ) {}

  async create(
    userId: string,
    dto: CreateTransferDto,
  ): Promise<TransferEntity> {
    // check for duplicate transfer
    const existing = await this.prisma.transfer.findUnique({
      where: { idempotencyKey: dto.idempotencyKey },
      select: transferSelect,
    });
    if (existing) {
      if (existing.fromAccount.userId !== userId) {
        throw new ConflictException('Idempotency key is already in use');
      }
      return this.toEntity(existing);
    }

    // check the amount
    if (dto.amount <= 0) {
      throw new BadRequestException('Amount must be greater than 0');
    }

    // find the sender account
    const sender = await this.prisma.account.findUnique({
      where: { userId },
      select: { id: true, currency: true },
    });
    if (!sender) {
      throw new NotFoundException('Sender account not found');
    }

    // find the recipient
    const recipient = await this.prisma.user.findUnique({
      where: { email: dto.toEmail },
      select: {
        id: true,
        account: { select: { id: true, currency: true } },
      },
    });
    if (!recipient) {
      throw new NotFoundException('Recipient not found');
    }
    if (recipient.id === userId) {
      throw new BadRequestException('Cannot transfer to yourself');
    }
    if (!recipient.account) {
      throw new NotFoundException('Recipient account not found');
    }
    const receiver = recipient.account;
    if (sender.currency !== receiver.currency) {
      throw new BadRequestException('Accounts use different currencies');
    }

    const amount = new Prisma.Decimal(dto.amount.toString());

    try {
      // move the money in one transaction
      const result = await this.prisma.$transaction(
        async (tx) => {
          const accountIds = [sender.id, receiver.id].sort();
          const lockedAccounts: LockedAccount[] = [];

          // lock both accounts in the same order
          for (const accountId of accountIds) {
            const rows = await tx.$queryRaw<LockedAccount[]>`
              SELECT "id", "balance", "currency"
              FROM "accounts"
              WHERE "id" = ${accountId}::uuid
              FOR UPDATE
            `;
            if (!rows[0]) {
              throw new NotFoundException('Account not found');
            }
            lockedAccounts.push(rows[0]);
          }

          // check again after the locks
          const duplicate = await tx.transfer.findUnique({
            where: { idempotencyKey: dto.idempotencyKey },
            select: transferSelect,
          });
          if (duplicate) {
            if (duplicate.fromAccount.userId !== userId) {
              throw new ConflictException('Idempotency key is already in use');
            }
            return { transfer: duplicate, created: false };
          }

          const lockedSender = lockedAccounts.find(
            (account) => account.id === sender.id,
          );
          if (!lockedSender) {
            throw new NotFoundException('Sender account not found');
          }
          if (new Prisma.Decimal(lockedSender.balance).lessThan(amount)) {
            throw new BadRequestException('Insufficient balance');
          }

          // update both balances
          await tx.account.update({
            where: { id: sender.id },
            data: { balance: { decrement: amount } },
          });
          await tx.account.update({
            where: { id: receiver.id },
            data: { balance: { increment: amount } },
          });

          // save the transfer and both records
          const transfer = await tx.transfer.create({
            data: {
              idempotencyKey: dto.idempotencyKey,
              fromAccountId: sender.id,
              toAccountId: receiver.id,
              amount,
              status: TransferStatus.COMPLETED,
              description: dto.description,
              transactions: {
                create: [
                  {
                    accountId: sender.id,
                    type: TransactionType.DEBIT,
                    amount,
                    description: dto.description,
                  },
                  {
                    accountId: receiver.id,
                    type: TransactionType.CREDIT,
                    amount,
                    description: dto.description,
                  },
                ],
              },
            },
            select: transferSelect,
          });

          return { transfer, created: true };
        },
        { maxWait: 10_000, timeout: 30_000 },
      );

      // start AI work after the transfer is done
      if (result.created) {
        this.categorize(result.transfer, userId, recipient.id);
      }

      return this.toEntity(result.transfer);
    } catch (error: unknown) {
      // return the saved transfer after a unique key race
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2002'
      ) {
        const duplicate = await this.prisma.transfer.findUnique({
          where: { idempotencyKey: dto.idempotencyKey },
          select: transferSelect,
        });
        if (duplicate) {
          if (duplicate.fromAccount.userId !== userId) {
            throw new ConflictException('Idempotency key is already in use');
          }
          return this.toEntity(duplicate);
        }
      }

      // return a clear error for a database conflict
      const code = (error as { code?: string }).code;
      if (code === 'P2034' || code === '40001' || code === '40P01') {
        throw new ConflictException('Transfer conflict. Please retry');
      }

      throw error;
    }
  }

  async listForUser(userId: string): Promise<TransferEntity[]> {
    // find the user account
    const account = await this.prisma.account.findUnique({
      where: { userId },
      select: { id: true },
    });
    if (!account) {
      throw new NotFoundException('Account not found');
    }

    // get sent and received transfers
    const transfers = await this.prisma.transfer.findMany({
      where: {
        OR: [{ fromAccountId: account.id }, { toAccountId: account.id }],
      },
      orderBy: { createdAt: 'desc' },
      select: transferSelect,
    });

    return transfers.map((transfer) => this.toEntity(transfer));
  }

  private categorize(
    transfer: TransferRecord,
    senderUserId: string,
    recipientUserId: string,
  ): void {
    // categorize both records in the background
    for (const transaction of transfer.transactions) {
      const userId =
        transaction.accountId === transfer.fromAccountId
          ? senderUserId
          : recipientUserId;

      void this.categorization
        .categorizeTransaction(transaction.id, {
          type: transaction.type,
          amount: transaction.amount.toFixed(2),
          description: transaction.description,
          userId,
        })
        .catch((error: unknown) => {
          const message =
            error instanceof Error ? error.message : String(error);
          this.logger.warn(`Category update failed: ${message}`);
        });
    }
  }

  private toEntity(transfer: TransferRecord): TransferEntity {
    return {
      id: transfer.id,
      idempotencyKey: transfer.idempotencyKey,
      from: {
        accountId: transfer.fromAccount.id,
        name: transfer.fromAccount.user.name,
        email: transfer.fromAccount.user.email,
      },
      to: {
        accountId: transfer.toAccount.id,
        name: transfer.toAccount.user.name,
        email: transfer.toAccount.user.email,
      },
      amount: transfer.amount.toFixed(2),
      status: transfer.status,
      description: transfer.description,
      createdAt: transfer.createdAt,
    };
  }
}
