import { ApiProperty } from '@nestjs/swagger';

export class UserEntity {
  @ApiProperty({ format: 'uuid' })
  id: string;

  @ApiProperty({ example: 'alex@example.com' })
  email: string;

  @ApiProperty({ example: 'Alex Morgan' })
  name: string;

  @ApiProperty({ format: 'date-time' })
  createdAt: Date;
}
