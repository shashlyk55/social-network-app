import { CreateChatDto } from '../dto/create-chat.dto';
import { UpdateChatDto } from '../dto/update-chat.dto';
import {
  CreateChatParams,
  FindAllChatsParams,
  UpdateChatParams,
} from '../types/chat-service.types';

export class ChatsParamsMapper {
  static toCreateChatParams(
    userId: number,
    dto: CreateChatDto,
  ): CreateChatParams {
    return {
      creatorId: userId,
      name: dto.name,
      type: dto.type,
      participantIds: dto.participantIds,
      adminIds: dto.adminIds,
      avatarId: dto.avatarId,
    };
  }

  static toFindAllChatsParams(query: any): FindAllChatsParams {
    return {
      page: query.page ? parseInt(query.page) : undefined,
      limit: query.limit ? parseInt(query.limit) : undefined,
      userId: query.userId ? parseInt(query.userId) : undefined,
      type: query.type,
      search: query.search,
      sortBy: query.sortBy,
      sortOrder: query.sortOrder,
    };
  }

  static toUpdateChatParams(dto: UpdateChatDto): UpdateChatParams {
    return {
      name: dto.name,
      avatarId: dto.avatarId,
    };
  }
}
