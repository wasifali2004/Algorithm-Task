import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { TransferStatus } from '../../generated/prisma/enums';

class TransferPartyEntity {
  @ApiProperty({ format: 'uuid' })
  accountId: string;

  @ApiProperty({ example: 'Alex Morgan' })
  name: string;

  @ApiProperty({ example: 'alex@example.com' })
  email: string;
}

export class TransferEntity {
  @ApiProperty({ format: 'uuid' })
  id: string;

  @ApiProperty({ format: 'uuid' })
  idempotencyKey: string;

  @ApiProperty({ type: TransferPartyEntity })
  from: TransferPartyEntity;

  @ApiProperty({ type: TransferPartyEntity })
  to: TransferPartyEntity;

  @ApiProperty({ example: '25.50', description: 'Exact decimal amount' })
  amount: string;

  @ApiProperty({ enum: TransferStatus })
  status: TransferStatus;

  @ApiPropertyOptional({ nullable: true, example: 'Dinner reimbursement' })
  description: string | null;

  @ApiProperty({ format: 'date-time' })
  createdAt: Date;
}
