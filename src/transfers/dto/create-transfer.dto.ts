import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import {
  IsEmail,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  IsUUID,
  Max,
  MaxLength,
} from 'class-validator';

export class CreateTransferDto {
  @ApiProperty({
    format: 'uuid',
    example: '6f1be2a2-d12a-4d70-a0f2-d59ca18a451d',
  })
  @IsUUID('4', { message: 'Idempotency key must be a valid UUID' })
  idempotencyKey: string;

  @ApiProperty({ example: 'recipient@example.com' })
  @Transform(({ value }: { value: unknown }) =>
    typeof value === 'string' ? value.trim().toLowerCase() : value,
  )
  @IsEmail({}, { message: 'Recipient email must be valid' })
  @MaxLength(320, {
    message: 'Recipient email must be 320 characters or fewer',
  })
  toEmail: string;

  @ApiProperty({ example: 25.5, minimum: 0.01 })
  @Type(() => Number)
  @IsNumber(
    { allowInfinity: false, allowNaN: false, maxDecimalPlaces: 2 },
    { message: 'Amount must be a number with no more than 2 decimal places' },
  )
  @IsPositive({ message: 'Amount must be greater than 0' })
  @Max(9_000_000_000_000, { message: 'Amount is too large' })
  amount: number;

  @ApiPropertyOptional({ example: 'Dinner reimbursement', maxLength: 500 })
  @Transform(({ value }: { value: unknown }) => {
    // remove an empty description
    if (typeof value !== 'string') {
      return value;
    }
    const trimmed = value.trim();
    return trimmed.length ? trimmed : undefined;
  })
  @IsOptional()
  @IsString({ message: 'Description must be a string' })
  @MaxLength(500, { message: 'Description must be 500 characters or fewer' })
  description?: string;
}
