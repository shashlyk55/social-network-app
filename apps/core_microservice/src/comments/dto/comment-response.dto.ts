import { ApiProperty } from '@nestjs/swagger';

class AuthorDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  email: string;

  @ApiProperty()
  name: string;

  @ApiProperty({ required: false })
  avatarId?: number;
}

export class CommentResponseDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  content: string;

  @ApiProperty()
  authorId: number;

  @ApiProperty()
  postId: number;

  @ApiProperty()
  author: AuthorDto;

  @ApiProperty()
  likesCount: number;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}

export class CommentsListResponseDto {
  @ApiProperty({ type: [CommentResponseDto] })
  comments: CommentResponseDto[];

  @ApiProperty()
  total: number;

  @ApiProperty()
  page: number;

  @ApiProperty()
  limit: number;

  @ApiProperty()
  totalPages: number;
}
