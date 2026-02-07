import { ChatParticipantService } from "@/services/chat-participants.service";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const useAddParticipants = (chatId: number) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (profileIds: number[]) =>
      ChatParticipantService.addMany(chatId, profileIds),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["chat-participants", chatId],
      });
    },
  });
};
