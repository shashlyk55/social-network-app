import { Chat } from 'src/entities/chat.entity';

export type CreateChatParams = {
  name: string;
  description?: string;
  type: string;
  createdById: number;
  participantProfileIds: number[];
};

export type UpdateChatParams = {
  id: number;
  name?: string;
  description?: string;
  type?: string;
  updatedById?: number;
};

export type FindChatsParams = {
  page?: number;
  limit?: number;
  type?: string;
  profileId?: number;
};

export type ChatPaginationResult = {
  data: Chat[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
};
