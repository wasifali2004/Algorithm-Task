import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsIn, IsString } from 'class-validator';
import {
  CATEGORY_LABELS,
  CategoryLabel,
} from '../../common/constants/categories';

export class CorrectCategoryDto {
  @ApiProperty({ enum: CATEGORY_LABELS, example: 'Food & Dining' })
  @Transform(({ value }: { value: unknown }) =>
    typeof value === 'string' ? value.trim() : value,
  )
  @IsString({ message: 'Category must be a string' })
  @IsIn(CATEGORY_LABELS, {
    message: `Category must be one of: ${CATEGORY_LABELS.join(', ')}`,
  })
  category: CategoryLabel;
}
