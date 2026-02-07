import { Expose } from 'class-transformer';
import { ChatType } from 'src/entities/chat.entity';

export class BaseChatDto {
  @Expose()
  id: number;

  @Expose()
  type: ChatType;

  @Expose()
  name: string | null;

  @Expose()
  createdAt: Date;

  @Expose()
  updatedAt: Date;
}
