import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useActiveChatStore } from "@/store/use-active-chat-store";
import { ChatParticipantService } from "@/services/chat-participants.service";
import { useMe } from "@/hooks/profile/use-me";
import { PaginatedData } from "@/types/pagination";
import { ChatParticipant } from "@/types/chat-participant";
import { ChatPreview } from "@/types/chat";

export const useRemoveParticipant = (chatId: number) => {
  const queryClient = useQueryClient();
  const { setActiveChatId, activeChatId } = useActiveChatStore();
  const { data: me } = useMe();

  return useMutation({
    mutationFn: (profileId: number) =>
      ChatParticipantService.remove(chatId, profileId),
    onSuccess: (_, profileId) => {
      const isMe = profileId === me?.id;

      if (isMe) {
        queryClient.setQueriesData<PaginatedData<ChatPreview>>(
          { queryKey: ["chats"] },
          (oldData) => {
            if (!oldData) return oldData;
            return {
              ...oldData,
              data: oldData.data.filter((chat) => chat.id !== chatId),
              meta: {
                ...oldData.meta,
                total: oldData.meta.total - 1,
              },
            };
          }
        );

        if (activeChatId === chatId) {
          setActiveChatId(null);
        }
      }

      queryClient.setQueriesData<PaginatedData<ChatParticipant>>(
        { queryKey: ["chat-participants", chatId] },
        (oldData) => {
          if (!oldData) return oldData;

          const isAlreadyRemoved = !oldData.data.some(
            (p) => p.profile.id === profileId
          );
          if (isAlreadyRemoved) return oldData;

          return {
            ...oldData,
            data: oldData.data.filter((p) => p.profile.id !== profileId),
            meta: {
              ...oldData.meta,
              total: Math.max(0, oldData.meta.total - 1),
            },
          };
        }
      );
    },
  });
};
