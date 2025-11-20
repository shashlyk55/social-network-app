import { ApiProperty } from '@nestjs/swagger';
import { UserRole } from 'src/entities/user.entity';

class UserReferenceDto {
  @ApiProperty({ example: 1, description: 'User ID' })
  id: number;

  @ApiProperty({
    example: UserRole.ADMIN,
    enum: UserRole,
    description: 'User role',
  })
  role: UserRole;
}

class ProfileReferenceDto {
  @ApiProperty({ example: 1, description: 'Profile ID' })
  id: number;

  @ApiProperty({ example: 'john_doe', description: 'Username' })
  username: string;

  @ApiProperty({ example: 'John Doe', description: 'Display name' })
  displayName: string;
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

class PostLikeResponseDto {
  @ApiProperty({ example: 1, description: 'Post like ID' })
  id: number;

  @ApiProperty({ example: 1, description: 'Profile ID' })
  profileId: number;

  @ApiProperty({ description: 'Creation date' })
  createdAt: Date;

  @ApiProperty({
    type: ProfileReferenceDto,
    description: 'Profile that liked the post',
  })
  profile: ProfileReferenceDto;
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

  @ApiProperty({
    type: UserReferenceDto,
    description: 'User who created this post',
  })
  createdBy: UserReferenceDto;

  @ApiProperty({
    type: UserReferenceDto,
    description: 'User who updated this post',
    nullable: true,
  })
  updatedBy?: UserReferenceDto;

  @ApiProperty({ type: [PostAssetResponseDto], description: 'Post assets' })
  assets: PostAssetResponseDto[];

  @ApiProperty({ type: [PostLikeResponseDto], description: 'Post likes' })
  likes: PostLikeResponseDto[];

  @ApiProperty({ example: 5, description: 'Number of comments' })
  commentsCount: number;

  @ApiProperty({ example: 10, description: 'Number of likes' })
  likesCount: number;
}
