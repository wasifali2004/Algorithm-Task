import { ApiProperty } from '@nestjs/swagger';

export class InsightTransactionEntity {
  @ApiProperty({ format: 'uuid' })
  id: string;

  @ApiProperty({ example: '125.50' })
  amount: string;

  @ApiProperty({ example: 'Shopping' })
  category: string;

  @ApiProperty({ nullable: true, example: 'New headphones' })
  description: string | null;

  @ApiProperty({ format: 'date-time' })
  createdAt: Date;
}
