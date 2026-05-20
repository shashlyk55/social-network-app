import { Expose } from 'class-transformer';
import { BaseProfileDto } from './base-profile.dto';

export class MyProfileDto extends BaseProfileDto {
  @Expose() birthday?: Date | null;
  @Expose() postsCount: number;
  @Expose() createdAt: Date;
}
