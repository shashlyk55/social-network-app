import { ChatParticipantService } from "@/services/chat-participants.service";
import { useQuery } from "@tanstack/react-query";

export const useChatParticipants = (chatId: number, page: number = 1) => {
  return useQuery({
    queryKey: ["chat-participants", chatId, page],
    queryFn: () => ChatParticipantService.findAll(chatId, page),
    enabled: !!chatId,
    staleTime: 1000 * 60 * 5,
  });
};
