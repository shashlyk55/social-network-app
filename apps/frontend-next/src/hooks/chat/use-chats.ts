import { useQuery } from "@tanstack/react-query";
import { ChatService } from "@/services/chat.service";
import { FindChatParams } from "@/types/chat";

export const useChats = (params: FindChatParams) => {
  return useQuery({
    queryKey: ["chats", params],
    queryFn: () => ChatService.findAll(params),
    placeholderData: (previousData) => previousData,
  });
};
