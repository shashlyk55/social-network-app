import { Chat, ChatType } from 'src/entities/chat.entity';
import { CreateMessageParams } from 'src/messages/types/message-service.types';

export type CreateChatParams = {
  name?: string;
  description?: string | null;
  type: ChatType;
  participantProfileIds?: number[];
  firstMessage?: CreateMessageParams;
};

export type UpdateChatParams = {
  id: number;
  name?: string;
  description?: string | null;
  type: ChatType;
};

export type FindChatsParams = {
  page?: number;
  limit?: number;
  type?: ChatType;
};

export type ChatPaginationResult = {
  data: Chat[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
};
