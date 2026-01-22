import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class ProfilePreviewDto {
  @ApiProperty({ example: 1 })
  @Expose()
  id: number;

  @ApiProperty({ example: 'johndoe' })
  @Expose()
  username: string;

  @ApiProperty({ example: 'John Doe' })
  @Expose()
  displayName: string;

  @ApiProperty({ example: 'https://cdn.com/avatar.png', nullable: true })
  @Expose()
  avatarUrl?: string | null;

  @ApiProperty({ example: true })
  @Expose()
  isFollowed: boolean;
}
