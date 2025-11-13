import { Chat } from 'src/entities/chat.entity';

export interface CreateChatParams {
  name: string;
  description?: string;
  type: string;
  createdById: number;
  participantProfileIds: number[];
}

export interface UpdateChatParams {
  id: number;
  name?: string;
  description?: string;
  type?: string;
  updatedById?: number;
}

export interface FindChatsParams {
  page?: number;
  limit?: number;
  type?: string;
  profileId?: number;
}

export interface ChatPaginationResult {
  data: Chat[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
