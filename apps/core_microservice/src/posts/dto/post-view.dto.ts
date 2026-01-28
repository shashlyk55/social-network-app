import { Expose, Type } from 'class-transformer';
import { BasePostDto } from './base-post.dto';
import { PostAssetDto } from './post-asset.dto';

export class PostViewDto extends BasePostDto {
  @Expose()
  isLiked: boolean;

  @Expose()
  likesCount: number;

  @Expose()
  commentsCount: number;

  @Expose()
  @Type(() => PostAssetDto)
  postAssets: PostAssetDto[];
}
