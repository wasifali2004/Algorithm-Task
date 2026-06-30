import { ApiProperty } from '@nestjs/swagger';
import { InsightTransactionEntity } from '../entities/insight-transaction.entity';

class CategoryTotalDto {
  @ApiProperty({ example: 'Food & Dining' })
  category: string;

  @ApiProperty({ example: '230.25' })
  total: string;
}

class MonthlyTotalDto {
  @ApiProperty({ example: '2026-06' })
  month: string;

  @ApiProperty({ example: '450.00' })
  total: string;
}

export class InsightsResponseDto {
  @ApiProperty({ type: [CategoryTotalDto] })
  categoryBreakdown: CategoryTotalDto[];

  @ApiProperty({ type: [MonthlyTotalDto] })
  monthlyTotals: MonthlyTotalDto[];

  @ApiProperty({ type: [InsightTransactionEntity] })
  unusualTransactions: InsightTransactionEntity[];

  @ApiProperty({ type: InsightTransactionEntity, nullable: true })
  largestTransaction: InsightTransactionEntity | null;

  @ApiProperty({ example: 'Most of your spending this month was on shopping.' })
  summary: string;
}
