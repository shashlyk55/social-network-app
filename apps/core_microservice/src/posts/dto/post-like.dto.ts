import { Expose } from 'class-transformer';

export class PostLikeDto {
  @Expose()
  postId: number;

  @Expose()
  isLiked: boolean;

  @Expose()
  likesCount: number;
}
