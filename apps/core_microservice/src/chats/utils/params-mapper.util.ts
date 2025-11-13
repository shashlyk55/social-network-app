import { Chat } from 'src/entities/chat.entity';
import { PaginationResponseDto } from 'src/users/dto/pagination-response.dto';
import { ChatResponseDto } from '../dto/chat-response.dto';
import { CreateChatDto } from '../dto/create-chat.dto';
import { UpdateChatDto } from '../dto/update-chat.dto';
import {
  CreateChatParams,
  UpdateChatParams,
  ChatPaginationResult,
} from '../types/chat-service.types';

export class ChatMappers {
  static toCreateParams(dto: CreateChatDto): CreateChatParams {
    return {
      name: dto.name,
      description: dto.description,
      type: dto.type,
      createdById: dto.createdById,
      participantProfileIds: dto.participantProfileIds,
    };
  }

  static toUpdateParams(id: number, dto: UpdateChatDto): UpdateChatParams {
    return {
      id,
      name: dto.name,
      description: dto.description,
      type: dto.type,
      updatedById: dto.updatedById,
    };
  }

  static toChatResponse(chat: Chat): ChatResponseDto {
    const response: ChatResponseDto = {
      id: chat.id,
      name: chat.name,
      description: chat.description,
      type: chat.type,
      createdAt: chat.createdAt,
      updatedAt: chat.updatedAt,
      createdById: chat.createdById,
      updatedById: chat.updatedById,
      createdBy: {
        id: chat.createdBy.id,
        role: chat.createdBy.role,
      },
      participants: [],
    };

    if (chat.updatedBy) {
      response.updatedBy = {
        id: chat.updatedBy.id,
        role: chat.updatedBy.role,
      };
    }

    if (chat.chatParticipants) {
      response.participants = chat.chatParticipants.map((participant) => ({
        id: participant.id,
        profileId: participant.profileId,
        role: participant.role,
        joinedAt: participant.joinedAt,
        leftAt: participant.leftAt,
        createdBy: {
          id: participant.createdBy.id,
          role: participant.createdBy.role,
        },
      }));
    }

    return response;
  }

  static toPaginationResponse(
    result: ChatPaginationResult,
  ): PaginationResponseDto<ChatResponseDto> {
    return {
      data: result.data.map((chat) => this.toChatResponse(chat)),
      meta: {
        page: result.page,
        limit: result.limit,
        total: result.total,
        totalPages: result.totalPages,
      },
    };
  }
}
