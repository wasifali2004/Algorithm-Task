import { ApiProperty } from '@nestjs/swagger';
import { AccountEntity } from '../entities/account.entity';

class AccountOwnerDto {
  @ApiProperty({ example: 'Alex Morgan' })
  name: string;

  @ApiProperty({ example: 'alex@example.com' })
  email: string;
}

export class AccountResponseDto extends AccountEntity {
  @ApiProperty({ type: AccountOwnerDto })
  user: AccountOwnerDto;
}
