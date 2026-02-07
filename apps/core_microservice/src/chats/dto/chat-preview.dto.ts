import { Expose, plainToInstance, Transform, Type } from 'class-transformer';
import { ChatType } from 'src/entities/chat.entity';
import { BaseChatDto } from './base-chat.dto';
import { ChatParticipantDto } from 'src/chat-participants/dto/chat-participant.dto';

export class ChatPreviewDto extends BaseChatDto {
  @Expose()
  declare name: string | null;

  @Expose()
  @Type(() => ChatParticipantDto)
  @Transform(({ obj, options }) => {
    if (obj.type !== ChatType.PRIVATE) return null;

    const currentUserId = options?.groups
      ?.find((g) => g.startsWith('userId_'))
      ?.split('_')[1];

    const other = obj.chatParticipants?.find((p) => {
      return p.profile.userId.toString() !== currentUserId;
    });

    if (!other) return null;

    return plainToInstance(ChatParticipantDto, other, {
      excludeExtraneousValues: true,
    });
  })
  interlocutor: ChatParticipantDto | null;
}
