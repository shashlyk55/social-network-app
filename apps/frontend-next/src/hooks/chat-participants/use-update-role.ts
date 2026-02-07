import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ChatParticipant, ChatParticipantRole } from "@/types/chat-participant";
import { ChatParticipantService } from "@/services/chat-participants.service";
import { PaginatedData } from "@/types/pagination";
import { toast } from "sonner";

export const useUpdateRole = (chatId: number) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      profileId,
      role,
    }: {
      profileId: number;
      role: ChatParticipantRole;
    }) => ChatParticipantService.updateRole(chatId, profileId, role),

    onSuccess: (_, variables) => {
      const { profileId, role } = variables;

      queryClient
        .getQueriesData<PaginatedData<ChatParticipant>>({
          queryKey: ["chat-participants", chatId],
        })
        .forEach(([queryKey, oldData]) => {
          if (!oldData) return;

          queryClient.setQueryData(
            queryKey,
            (old: PaginatedData<ChatParticipant> | undefined) => {
              if (!old) return old;

              return {
                ...old,
                data: old.data.map((p) =>
                  p.profile.id === profileId ? { ...p, role: role } : p
                ),
              };
            }
          );
        });

      toast.success("Role updated");
    },
    onError: () => {
      toast.error("Failed to update role");
    },
  });
};
