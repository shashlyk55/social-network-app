import { ChatService } from "@/services/chat.service";
import { ChatPreview, CreateChatParams } from "@/types/chat";
import { ApiError } from "@/types/errors";
import { PaginatedData } from "@/types/pagination";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const useCreateChat = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (newChat: CreateChatParams) => ChatService.create(newChat),
    onSuccess: (createdChat: ChatPreview) => {
      queryClient.setQueriesData<PaginatedData<ChatPreview>>(
        { queryKey: ["chats"] },
        (oldData) => {
          if (!oldData) return oldData;

          return {
            ...oldData,
            data: [createdChat, ...oldData.data],
            meta: {
              ...oldData.meta,
              total: oldData.meta.total + 1,
            },
          };
        }
      );
    },
    onError: (error: ApiError) => {
      console.error("Ошибка при создании чата:", error.response?.data?.message);
    },
  });
};
