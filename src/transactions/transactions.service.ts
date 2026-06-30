import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import {
  CATEGORY_TO_LABEL,
  LABEL_TO_CATEGORY,
} from '../common/constants/categories';
import { PrismaService } from '../prisma/prisma.service';
import { CorrectCategoryDto } from './dto/correct-category.dto';
import { TransactionEntity } from './entities/transaction.entity';

const transactionSelect = {
  id: true,
  type: true,
  amount: true,
  category: true,
  correctedCategory: true,
  description: true,
  createdAt: true,
} as const;

@Injectable()
export class TransactionsService {
  constructor(private readonly prisma: PrismaService) {}

  async listForUser(userId: string): Promise<TransactionEntity[]> {
    // get the user records
    const transactions = await this.prisma.transaction.findMany({
      where: { account: { userId } },
      orderBy: { createdAt: 'desc' },
      select: transactionSelect,
    });

    return transactions.map((transaction) => this.toEntity(transaction));
  }

  async correctCategory(
    userId: string,
    transactionId: string,
    dto: CorrectCategoryDto,
  ): Promise<TransactionEntity> {
    // find the user record
    const transaction = await this.prisma.transaction.findFirst({
      where: { id: transactionId, account: { userId } },
      select: transactionSelect,
    });
    if (!transaction) {
      throw new NotFoundException('Transaction not found');
    }

    const oldCategory = transaction.correctedCategory ?? transaction.category;
    const newCategory = LABEL_TO_CATEGORY[dto.category];
    if (oldCategory === newCategory) {
      throw new BadRequestException(`Category is already ${dto.category}`);
    }

    // save the correction and update the record
    const [, updated] = await this.prisma.$transaction([
      this.prisma.categoryCorrection.create({
        data: {
          transactionId,
          originalCategory: oldCategory,
          correctedCategory: newCategory,
        },
      }),
      this.prisma.transaction.update({
        where: { id: transactionId },
        data: { correctedCategory: newCategory },
        select: transactionSelect,
      }),
    ]);

    return this.toEntity(updated);
  }

  private toEntity(transaction: {
    id: string;
    type: TransactionEntity['type'];
    amount: { toFixed(places: number): string };
    category: keyof typeof CATEGORY_TO_LABEL;
    correctedCategory: keyof typeof CATEGORY_TO_LABEL | null;
    description: string | null;
    createdAt: Date;
  }): TransactionEntity {
    const category = CATEGORY_TO_LABEL[transaction.category];
    const correctedCategory = transaction.correctedCategory
      ? CATEGORY_TO_LABEL[transaction.correctedCategory]
      : null;

    return {
      id: transaction.id,
      type: transaction.type,
      amount: transaction.amount.toFixed(2),
      category,
      correctedCategory,
      effectiveCategory: correctedCategory ?? category,
      description: transaction.description,
      createdAt: transaction.createdAt,
    };
  }
}
