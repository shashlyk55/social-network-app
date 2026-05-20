import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class ProfileResponseDto {
  @ApiProperty()
  id: number;

  // @ApiProperty()
  // userId: number;

  @ApiProperty()
  username: string;

  @ApiProperty()
  displayName: string;

  @ApiProperty({ type: Date, nullable: true })
  birthday?: Date | null;

  @ApiPropertyOptional({ type: String, nullable: true })
  bio?: string | null;

  @ApiPropertyOptional({ type: String, nullable: true })
  avatarUrl?: string | null;

  @ApiProperty()
  isPublic: boolean;

  @ApiProperty()
  createdAt: Date;
}
