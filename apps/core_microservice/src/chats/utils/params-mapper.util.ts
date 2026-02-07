import { ChatType } from 'src/entities/chat.entity';
import { CreateChatDto } from '../dto/create-chat.dto';
import { UpdateChatDto } from '../dto/update-chat.dto';
import {
  CreateChatParams,
  UpdateChatParams,
} from '../types/chat-service.types';

export class ChatMappers {
  static toCreateParams(dto: CreateChatDto): CreateChatParams {
    const params: CreateChatParams = {
      name: dto.name,
      description: dto.description,
      type: dto.type,
      participantProfileIds:
        dto.participantProfileIds && dto.participantProfileIds.length > 0
          ? [...dto.participantProfileIds]
          : [],
    };

    if (dto.firstMessage && dto.type === ChatType.PRIVATE) {
      params.firstMessage = {
        content: dto.firstMessage.content,
        replyToMessageId: dto.firstMessage.replyToMessageId,
      };
    }

    return params;
  }

  static toUpdateParams(id: number, dto: UpdateChatDto): UpdateChatParams {
    return {
      id,
      name: dto.name,
      description: dto.description,
      type: dto.type,
    };
  }
}
