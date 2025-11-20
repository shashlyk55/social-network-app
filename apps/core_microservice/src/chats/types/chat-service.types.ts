import { Chat, ChatType } from 'src/entities/chat.entity';

export type CreateChatParams = {
  name: string;
  description?: string;
  type: ChatType;
  createdById: number;
  participantProfileIds: number[];
};

export type UpdateChatParams = {
  id: number;
  name?: string;
  description?: string;
  type?: ChatType;
  updatedById?: number;
};

export type FindChatsParams = {
  page?: number;
  limit?: number;
  type?: ChatType;
  profileId?: number;
};

export type ChatPaginationResult = {
  data: Chat[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
};
