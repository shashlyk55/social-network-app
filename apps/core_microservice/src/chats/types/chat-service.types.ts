export type CreateChatParams = {
  creatorId: number;
  name?: string;
  type: string;
  participantIds: number[];
  adminIds?: number[];
  avatarId?: number;
};

export type FindAllChatsParams = {
  page?: number;
  limit?: number;
  userId?: number;
  type?: string;
  search?: string;
  sortBy?: string;
  sortOrder?: 'ASC' | 'DESC';
};

export type FindAllChatsResult = {
  chats: any[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
};

export type UpdateChatParams = {
  name?: string;
  avatarId?: number;
};

// Basic types
export type UserChatParams = {
  userId: number;
  chatId: number;
};

export type ChatIdParams = {
  chatId: number;
};

export type UserIdParams = {
  userId: number;
};
