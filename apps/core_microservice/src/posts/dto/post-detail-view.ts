import { Expose, Type } from 'class-transformer';
import { BasePostDto } from './base-post.dto';
import { PostAssetDto } from './post-asset.dto';

export class PostDetailViewDto extends BasePostDto {
  @Expose()
  isLiked: boolean;

  @Expose()
  likesCount: number;

  @Expose()
  commentsCount: number;

  @Expose()
  @Type(() => PostAssetDto)
  postAssets: PostAssetDto[];

  // TODO: add comments list
}
