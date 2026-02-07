import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ChatService } from "@/services/chat.service";
import {
  UpdateChatParams,
  UpdatedChat,
  ChatPreview,
  ChatDetail,
} from "@/types/chat";
import { PaginatedData } from "@/types/pagination";
import { toast } from "sonner";

export const useUpdateChat = (chatId: number) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (values: UpdateChatParams) =>
      ChatService.update(chatId, values),
    onSuccess: (updatedChat: UpdatedChat) => {
      // queryClient.setQueryData<ChatDetail>(["chat", chatId], (oldChat) => {
      //   if (!oldChat) return undefined;
      //   return {
      //     ...oldChat,
      //     ...updatedChat,
      //   };
      // });
      queryClient.setQueryData<ChatDetail>(["chat", chatId], (oldChat) => {
        if (!oldChat) return undefined;
        return { ...oldChat, ...updatedChat };
      });

      queryClient.setQueriesData<PaginatedData<ChatPreview>>(
        { queryKey: ["chats"] },
        (oldData) => {
          if (!oldData) return oldData;
          return {
            ...oldData,
            data: oldData.data.map((chat) =>
              chat.id === chatId ? { ...chat, ...updatedChat } : chat
            ),
          };
        }
      );

      toast.success("Chat updated successfully");
    },
    onError: () => {
      toast.error("Failed to update chat");
    },
  });
};
