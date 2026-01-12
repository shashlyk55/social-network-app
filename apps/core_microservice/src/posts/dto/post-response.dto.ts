import { ApiProperty } from '@nestjs/swagger';

class ProfileReferenceDto {
  @ApiProperty({ example: 1, description: 'Profile ID' })
  id: number;

  @ApiProperty({ example: 'john_doe', description: 'Username' })
  username: string;

  @ApiProperty({ example: 'John Doe', description: 'Display name' })
  displayName: string;

  @ApiProperty({
    example: 'https://example.com/avatar.jpg',
    description: 'Profile avatar',
    nullable: true,
  })
  avatarUrl: string | null;
}

class PostAssetResponseDto {
  @ApiProperty({ example: 1, description: 'Post asset ID' })
  id: number;

  @ApiProperty({ example: 1, description: 'Asset ID' })
  assetId: number;

  @ApiProperty({ example: 0, description: 'Order index' })
  orderIndex: number;

  @ApiProperty({ description: 'Creation date' })
  createdAt: Date;
}

export class PostResponseDto {
  @ApiProperty({ example: 1, description: 'Post ID' })
  id: number;

  @ApiProperty({
    example: 'This is a post content',
    description: 'Post content',
  })
  content: string;

  @ApiProperty({ example: false, description: 'Whether post is archived' })
  isArchived: boolean;

  @ApiProperty({ description: 'Creation date' })
  createdAt: Date;

  @ApiProperty({ description: 'Update date' })
  updatedAt: Date;

  @ApiProperty({ example: 1, description: 'Profile ID' })
  profileId: number;

  @ApiProperty({ example: 1, description: 'Creator ID' })
  createdById: number;

  @ApiProperty({ example: 2, description: 'Updater ID', nullable: true })
  updatedById: number | null;

  @ApiProperty({
    type: ProfileReferenceDto,
    description: 'Post author profile',
  })
  profile: ProfileReferenceDto;

  @ApiProperty({ type: [PostAssetResponseDto], description: 'Post assets' })
  assets: PostAssetResponseDto[];

  @ApiProperty({ example: 5, description: 'Number of comments' })
  commentsCount: number;

  @ApiProperty({ example: 10, description: 'Number of likes' })
  likesCount: number;

  @ApiProperty({ example: true, description: 'Is current user liked post' })
  isLiked: boolean;
}
