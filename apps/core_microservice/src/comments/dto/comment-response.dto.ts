import { ApiProperty } from '@nestjs/swagger';

class UserReferenceDto {
  @ApiProperty({ example: 1, description: 'User ID' })
  id: number;

  @ApiProperty({ example: 'admin', description: 'User role' })
  role: string;
}

class ProfileReferenceDto {
  @ApiProperty({ example: 1, description: 'Profile ID' })
  id: number;

  @ApiProperty({ example: 'john_doe', description: 'Username' })
  username: string;

  @ApiProperty({ example: 'John Doe', description: 'Display name' })
  displayName: string;
}

class CommentLikeResponseDto {
  @ApiProperty({ example: 1, description: 'Comment like ID' })
  id: number;

  @ApiProperty({ example: 1, description: 'Profile ID' })
  profileId: number;

  @ApiProperty({ description: 'Creation date' })
  createdAt: Date;

  @ApiProperty({
    type: ProfileReferenceDto,
    description: 'Profile that liked the comment',
  })
  profile: ProfileReferenceDto;
}

export class CommentResponseDto {
  @ApiProperty({ example: 1, description: 'Comment ID' })
  id: number;

  @ApiProperty({ example: 'This is a comment', description: 'Comment content' })
  content: string;

  @ApiProperty({ description: 'Creation date' })
  createdAt: Date;

  @ApiProperty({ description: 'Update date' })
  updatedAt: Date;

  @ApiProperty({ example: 1, description: 'Post ID' })
  postId: number;

  @ApiProperty({ example: 1, description: 'Profile ID' })
  profileId: number;

  @ApiProperty({ example: 1, description: 'Parent comment ID', nullable: true })
  parentCommentId: number | null;

  @ApiProperty({ example: 1, description: 'Creator ID' })
  createdById: number;

  @ApiProperty({ example: 2, description: 'Updater ID', nullable: true })
  updatedById: number | null;

  @ApiProperty({
    type: ProfileReferenceDto,
    description: 'Comment author profile',
  })
  profile: ProfileReferenceDto;

  @ApiProperty({
    type: UserReferenceDto,
    description: 'User who created this comment',
  })
  createdBy: UserReferenceDto;

  @ApiProperty({
    type: UserReferenceDto,
    description: 'User who updated this comment',
    nullable: true,
  })
  updatedBy?: UserReferenceDto;

  @ApiProperty({ type: [CommentLikeResponseDto], description: 'Comment likes' })
  likes: CommentLikeResponseDto[];

  @ApiProperty({ type: [CommentResponseDto], description: 'Comment replies' })
  replies: CommentResponseDto[];

  @ApiProperty({ example: 5, description: 'Number of likes' })
  likesCount: number;

  @ApiProperty({ example: 3, description: 'Number of replies' })
  repliesCount: number;
}
