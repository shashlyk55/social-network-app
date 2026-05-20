import { Expose } from 'class-transformer';

export class CommentLikeDto {
  @Expose()
  commentId: number;

  @Expose()
  isLiked: boolean;

  @Expose()
  likesCount: number;
}
