import { apiClient } from "@/lib/api-client";
import { ChatParticipant, ChatParticipantRole } from "@/types/chat-participant";
import { PaginatedData } from "@/types/pagination";

export const ChatParticipantService = {
  findAll: async (chatId: number, page: number = 1, limit: number = 20) => {
    const { data } = await apiClient.get<PaginatedData<ChatParticipant>>(
      `/chats/${chatId}/participants`,
      { params: { page, limit } }
    );
    return data;
  },

  addMany: async (chatId: number, profileIds: number[]) => {
    const { data } = await apiClient.post<ChatParticipant[]>(
      `/chats/${chatId}/participants`,
      { profileIds }
    );
    return data;
  },

  remove: async (chatId: number, profileId: number) => {
    const { data } = await apiClient.delete<ChatParticipant>(
      `/chats/${chatId}/participants/${profileId}`
    );
    return data;
  },

  updateRole: async (
    chatId: number,
    profileId: number,
    role: ChatParticipantRole
  ) => {
    const { data } = await apiClient.patch<ChatParticipant>(
      `/chats/${chatId}/participants/${profileId}/role`,
      { role }
    );
    return data;
  },
};
