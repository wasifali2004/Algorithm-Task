import { ApiProperty } from '@nestjs/swagger';
import { CATEGORY_LABELS } from '../../common/constants/categories';
import { TransactionType } from '../../generated/prisma/enums';

export class CategoryCorrectionEntity {
  @ApiProperty({ enum: CATEGORY_LABELS })
  originalCategory: string;

  @ApiProperty({ enum: CATEGORY_LABELS })
  correctedCategory: string;

  @ApiProperty({ format: 'date-time' })
  createdAt: Date;
}

export class TransactionEntity {
  @ApiProperty({ format: 'uuid' })
  id: string;

  @ApiProperty({ enum: TransactionType })
  type: TransactionType;

  @ApiProperty({ example: '25.50', description: 'Exact decimal amount' })
  amount: string;

  @ApiProperty({ enum: CATEGORY_LABELS, description: 'AI-predicted category' })
  category: string;

  @ApiProperty({ enum: CATEGORY_LABELS, nullable: true })
  correctedCategory: string | null;

  @ApiProperty({ enum: CATEGORY_LABELS })
  effectiveCategory: string;

  @ApiProperty({ nullable: true, example: 'Lunch with a friend' })
  description: string | null;

  @ApiProperty({ format: 'date-time' })
  createdAt: Date;

  @ApiProperty({ type: [CategoryCorrectionEntity] })
  corrections: CategoryCorrectionEntity[];
}
