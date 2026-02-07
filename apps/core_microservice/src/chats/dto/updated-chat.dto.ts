import { Expose } from 'class-transformer';
import { ChatType } from 'src/entities/chat.entity';

export class UpdatedChatDto {
  @Expose()
  id: number;

  @Expose()
  type: ChatType;

  @Expose()
  name: string | null;

  @Expose()
  description: string | null;

  @Expose()
  updatedAt: Date;
}
