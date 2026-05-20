import { ApiProperty } from '@nestjs/swagger';

export class ProfilePreviewResponseDto {
  @ApiProperty({ example: 1 })
  id: number;

  @ApiProperty({ example: 'johndoe' })
  username: string;

  @ApiProperty({ example: 'John Doe' })
  displayName: string;

  @ApiProperty({ example: 'https://cdn.com/avatar.png', nullable: true })
  avatarUrl: string | null;

  @ApiProperty({ example: true })
  isPublic: boolean;
}
