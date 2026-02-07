import { useQuery } from "@tanstack/react-query";
import { ChatService } from "@/services/chat.service";

export const useChat = (id?: number) => {
  return useQuery({
    queryKey: ["chat", id],
    queryFn: () => ChatService.findOne(id!),
    enabled: !!id,
    staleTime: 1000 * 60,
  });
};
