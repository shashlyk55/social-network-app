import { Expose, Transform } from 'class-transformer';
import { BaseProfileDto } from './base-profile.dto';

export class OtherProfileDto extends BaseProfileDto {
  @Expose() isFollowed: boolean;
  @Expose() isFollowAccepted: boolean;
  @Expose() canViewFullProfile: boolean; // Флаг: (isPublic || isFollowed)
  @Expose() publicPostsCount?: number;
}
