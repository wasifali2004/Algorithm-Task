import { Injectable, Logger } from '@nestjs/common';
import { CATEGORY_TO_LABEL } from '../common/constants/categories';
import { Prisma } from '../generated/prisma/client';
import { TransactionType } from '../generated/prisma/enums';
import { InsightsResponseDto } from '../insights/dto/insights-response.dto';
import { InsightTransactionEntity } from '../insights/entities/insight-transaction.entity';
import { PrismaService } from '../prisma/prisma.service';
import { GeminiService } from './gemini.service';

type SpendingTransaction = {
  id: string;
  amount: Prisma.Decimal;
  category: keyof typeof CATEGORY_TO_LABEL;
  correctedCategory: keyof typeof CATEGORY_TO_LABEL | null;
  description: string | null;
  createdAt: Date;
};

@Injectable()
export class AiService {
  private readonly logger = new Logger(AiService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly gemini: GeminiService,
  ) {}

  async getInsights(userId: string): Promise<InsightsResponseDto> {
    // get all spending records
    const transactions = await this.prisma.transaction.findMany({
      where: { account: { userId }, type: TransactionType.DEBIT },
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        amount: true,
        category: true,
        correctedCategory: true,
        description: true,
        createdAt: true,
      },
    });

    // add totals by category
    const categoryTotals = new Map<string, Prisma.Decimal>();
    for (const transaction of transactions) {
      const category =
        CATEGORY_TO_LABEL[
          transaction.correctedCategory ?? transaction.category
        ];
      const total = categoryTotals.get(category) ?? new Prisma.Decimal(0);
      categoryTotals.set(category, total.plus(transaction.amount));
    }

    const categoryBreakdown = [...categoryTotals.entries()]
      .sort((a, b) => b[1].cmp(a[1]))
      .map(([category, total]) => ({ category, total: total.toFixed(2) }));

    // add totals for the last six months
    const months = this.getLastSixMonths();
    const monthTotals = new Map(
      months.map((month) => [month, new Prisma.Decimal(0)]),
    );
    for (const transaction of transactions) {
      const month = this.getMonth(transaction.createdAt);
      const total = monthTotals.get(month);
      if (total) {
        monthTotals.set(month, total.plus(transaction.amount));
      }
    }

    const monthlyTotals = months.map((month) => ({
      month,
      total: monthTotals.get(month)!.toFixed(2),
    }));

    // find the average and unusual records
    const totalSpent = transactions.reduce(
      (sum, item) => sum.plus(item.amount),
      new Prisma.Decimal(0),
    );
    const average = transactions.length
      ? totalSpent.dividedBy(transactions.length)
      : new Prisma.Decimal(0);
    const limit = average.times(2.5);
    const unusualTransactions = transactions
      .filter((item) => item.amount.greaterThan(limit))
      .map((item) => this.toInsightTransaction(item));

    // find the largest record
    const largest = transactions.reduce<SpendingTransaction | null>(
      (current, item) =>
        !current || item.amount.greaterThan(current.amount) ? item : current,
      null,
    );
    const largestTransaction = largest
      ? this.toInsightTransaction(largest)
      : null;

    const data = {
      categoryBreakdown,
      monthlyTotals,
      averageTransaction: average.toFixed(2),
      unusualTransactions,
      largestTransaction,
    };

    // ask Gemini to explain the data
    let summary = 'No spending data is available yet.';
    if (transactions.length) {
      try {
        const result = await this.gemini.generateText(
          'Write a short personal spending summary in plain words. Use 3 to 4 sentences. Do not invent facts.',
          JSON.stringify(data),
          220,
        );
        summary = result.text;
      } catch (error: unknown) {
        const message = error instanceof Error ? error.message : String(error);
        this.logger.warn(`AI summary failed: ${message}`);
        summary = `Your largest spending category is ${categoryBreakdown[0].category} at ${categoryBreakdown[0].total}. Review the unusual payments and monthly totals for changes.`;
      }
    }

    return {
      categoryBreakdown,
      monthlyTotals,
      unusualTransactions,
      largestTransaction,
      summary,
    };
  }

  private toInsightTransaction(
    transaction: SpendingTransaction,
  ): InsightTransactionEntity {
    return {
      id: transaction.id,
      amount: transaction.amount.toFixed(2),
      category:
        CATEGORY_TO_LABEL[
          transaction.correctedCategory ?? transaction.category
        ],
      description: transaction.description,
      createdAt: transaction.createdAt,
    };
  }

  private getLastSixMonths(): string[] {
    const now = new Date();
    const months: string[] = [];

    for (let count = 5; count >= 0; count -= 1) {
      const date = new Date(
        Date.UTC(now.getUTCFullYear(), now.getUTCMonth() - count, 1),
      );
      months.push(this.getMonth(date));
    }

    return months;
  }

  private getMonth(date: Date): string {
    const month = String(date.getUTCMonth() + 1).padStart(2, '0');
    return `${date.getUTCFullYear()}-${month}`;
  }
}
