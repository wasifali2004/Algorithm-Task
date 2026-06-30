import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AccountResponseDto } from './dto/account-response.dto';

@Injectable()
export class AccountsService {
  constructor(private readonly prisma: PrismaService) {}

  async getMine(userId: string): Promise<AccountResponseDto> {
    // find the user account
    const account = await this.prisma.account.findUnique({
      where: { userId },
      select: {
        id: true,
        balance: true,
        currency: true,
        createdAt: true,
        user: {
          select: {
            name: true,
            email: true,
          },
        },
      },
    });
    if (!account) {
      throw new NotFoundException('Account not found');
    }

    // format the balance
    return {
      ...account,
      balance: account.balance.toFixed(2),
    };
  }
}
