import { Expose, Type } from 'class-transformer';
import { ProfilePreviewDto } from 'src/profiles/dto/profile-preview.dto';

export class ChatParticipantDto {
  @Expose()
  id: number;

  @Expose()
  role: string;

  @Expose()
  joinedAt: Date;

  @Expose()
  @Type(() => ProfilePreviewDto)
  profile: ProfilePreviewDto;
}
