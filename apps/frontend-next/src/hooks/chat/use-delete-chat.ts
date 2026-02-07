import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ChatService } from "@/services/chat.service";
import { useActiveChatStore } from "@/store/use-active-chat-store";
import { PaginatedData } from "@/types/pagination";
import { ChatPreview } from "@/types/chat";
import { toast } from "sonner";

export const useDeleteChat = () => {
  const queryClient = useQueryClient();
  const { setActiveChatId } = useActiveChatStore();

  return useMutation({
    mutationFn: (chatId: number) => ChatService.delete(chatId),
    onSuccess: (_, chatId) => {
      // 1. Находим все ключи, которые начинаются с "chats"
      queryClient
        .getQueriesData({ queryKey: ["chats"] })
        .forEach(([queryKey, oldData]) => {
          if (!oldData) return;

          queryClient.setQueryData(
            queryKey,
            (old: PaginatedData<ChatPreview>) => {
              if (!old || !old.data) return old;
              return {
                ...old,
                data: old.data.filter(
                  (chat: ChatPreview) => chat.id !== chatId
                ),
              };
            }
          );
        });

      // 2. Удаляем детальные данные конкретного чата
      queryClient.removeQueries({ queryKey: ["chat", chatId] });

      setActiveChatId(null);
      toast.success("Chat deleted successfully");
    },
    onError: () => {
      toast.error("Failed to delete chat");
    },
  });
};
