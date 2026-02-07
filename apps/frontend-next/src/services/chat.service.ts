import { apiClient } from "@/lib/api-client";
import {
  ChatDetail,
  ChatPreview,
  CreateChatParams,
  FindChatParams,
  UpdateChatParams,
  UpdatedChat,
} from "@/types/chat";
import { PaginatedData } from "@/types/pagination";

export const ChatService = {
  async findAll(params: FindChatParams) {
    const { data } = await apiClient.get<PaginatedData<ChatPreview>>(
      "/chats/",
      { params }
    );
    return data;
  },

  async findOne(chatId: number) {
    const { data } = await apiClient.get<ChatDetail>(`/chats/${chatId}`);
    return data;
  },

  async create(createData: CreateChatParams): Promise<ChatPreview> {
    const { data } = await apiClient.post<ChatPreview>("/chats/", createData);
    return data;
  },

  async delete(chatId: number): Promise<void> {
    await apiClient.delete<void>(`/chats/${chatId}`);
  },

  async update(
    chatId: number,
    updateData: UpdateChatParams
  ): Promise<UpdatedChat> {
    const { data } = await apiClient.put<UpdatedChat>(
      `/chats/${chatId}`,
      updateData
    );
    return data;
  },
};
