import { Expose, Type } from 'class-transformer';
import { ProfilePreviewDto } from 'src/profiles/dto/profile-preview.dto';

export class BasePostDto {
  @Expose()
  id: number;

  @Expose()
  @Type(() => ProfilePreviewDto)
  profile: ProfilePreviewDto;

  @Expose()
  content: string;

  @Expose()
  createdAt: Date;
}
