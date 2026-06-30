import { ApiProperty } from '@nestjs/swagger';
import { UserEntity } from '../../users/entities/user.entity';

export class AuthResponseEntity {
  @ApiProperty({ description: 'Bearer token that expires in seven days' })
  accessToken: string;

  @ApiProperty({ type: UserEntity })
  user: UserEntity;
}
