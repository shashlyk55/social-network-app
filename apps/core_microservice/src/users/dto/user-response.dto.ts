import { ApiProperty } from '@nestjs/swagger';

export class UserResponseDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  email: string;

  @ApiProperty()
  name: string;

  @ApiProperty({ required: false })
  bio?: string;

  @ApiProperty()
  role: string;

  @ApiProperty({ required: false })
  avatarId?: number;

  @ApiProperty()
  lastOnlineAt?: Date;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}
