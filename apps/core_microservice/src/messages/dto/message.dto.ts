import { Expose } from 'class-transformer';
import { ProfilePreviewDto } from 'src/profiles/dto/profile-preview.dto';

export class MessageDto {
  @Expose()
  id: number;

  @Expose()
  chatId: number;

  @Expose()
  profile: ProfilePreviewDto;

  @Expose()
  content: string;

  @Expose()
  replyToMessageId: number | null;

  @Expose()
  isEdited: boolean;

  @Expose()
  createdAt: Date;
}
