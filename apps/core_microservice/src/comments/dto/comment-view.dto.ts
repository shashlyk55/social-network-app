import { Expose, Type } from 'class-transformer';
import { ProfilePreviewDto } from 'src/profiles/dto/profile-preview.dto';

export class CommentViewDto {
  @Expose()
  id: number;

  @Expose()
  content: string;

  @Expose()
  @Type(() => ProfilePreviewDto)
  profile: ProfilePreviewDto;

  @Expose()
  postId: number;

  @Expose()
  parentCommentId: number | null;

  @Expose()
  createdAt: Date;

  @Expose()
  likesCount: number;

  @Expose()
  isLiked: boolean;

  @Expose()
  repliesCount: number;
}
