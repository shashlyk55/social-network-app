import { Expose, Transform } from 'class-transformer';
import { BaseProfileDto } from './base-profile.dto';

export class OtherProfileDto extends BaseProfileDto {
  @Expose() isFollowed: boolean;
  @Expose() isFollowAccepted: boolean;
  @Expose() canViewFullProfile: boolean; // Флаг: (isPublic || isFollowed)

  @Transform(({ obj }) =>
    obj.canViewFullProfile ? obj.publicPostsCount : undefined,
  )
  @Expose()
  publicPostsCount?: number;

  @Expose()
  @Transform(({ obj, value }) => {
    // Если профиль публичный или пользователь подписан (accepted) — показываем bio
    // В противном случае возвращаем null или сообщение "Profile is private"
    return obj.canViewFullProfile ? value : undefined;
  })
  declare bio?: string | null;
}
