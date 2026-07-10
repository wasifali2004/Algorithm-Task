import { ApiProperty } from '@nestjs/swagger';

export class AccountEntity {
  @ApiProperty({ format: 'uuid' })
  id: string;

  @ApiProperty({ example: '0.00', description: 'Exact decimal balance' })
  balance: string;

  @ApiProperty({ example: 'USD' })
  currency: string;

  @ApiProperty({ format: 'date-time' })
  createdAt: Date;
}
