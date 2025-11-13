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

class PostAssetDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  assetId: number;

  @ApiProperty()
  order: number;

  @ApiProperty()
  asset: {
    id: number;
    url: string;
    type: string;
    filename: string;
  };
}

export class PostResponseDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  content: string;

  @ApiProperty()
  likesCount: number;

  @ApiProperty()
  commentsCount: number;

  @ApiProperty()
  sharesCount: number;

  @ApiProperty({ required: false })
  location?: string;

  @ApiProperty()
  isArchived: boolean;

  @ApiProperty({ required: false })
  archivedAt?: Date;

  @ApiProperty({ required: false })
  deletedAt?: Date;

  @ApiProperty()
  authorId: number;

  @ApiProperty()
  author: AuthorDto;

  @ApiProperty({ type: [PostAssetDto] })
  postAssets: PostAssetDto[];

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}

export class PostsListResponseDto {
  @ApiProperty({ type: [PostResponseDto] })
  posts: PostResponseDto[];

  @ApiProperty()
  total: number;

  @ApiProperty()
  page: number;

  @ApiProperty()
  limit: number;

  @ApiProperty()
  totalPages: number;
}
