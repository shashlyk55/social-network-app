import { Expose, Transform } from 'class-transformer';
import { BaseProfileDto } from './base-profile.dto';

export class MyProfileDto extends BaseProfileDto {
  @Expose() bio?: string | null;
  @Expose() birthday?: Date | null;
  @Expose() isPublic: boolean;
  @Expose() postsCount: number;
}
