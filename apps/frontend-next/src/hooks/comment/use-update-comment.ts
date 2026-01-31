import { useMutation, useQueryClient } from "@tanstack/react-query";
import { CommentService } from "@/services/comment.service";
import { toast } from "sonner";
import { CommentView, UpdateComment } from "@/types/comment";
import { PaginatedData } from "@/types/pagination";

export const useUpdateComment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      commentId,
      updatedData,
    }: {
      commentId: number;
      updatedData: UpdateComment;
    }) => CommentService.update(commentId, updatedData),
    onSuccess: (updatedComment) => {
      toast.success("Comment updated");

      queryClient.setQueriesData(
        { queryKey: ["comments"] },
        (oldData: PaginatedData<CommentView> | undefined) => {
          if (!oldData || !oldData.data) return oldData;

          return {
            ...oldData,
            data: oldData.data.map((c) =>
              c.id === updatedComment.id ? updatedComment : c
            ),
          };
        }
      );
    },
    onError: () => toast.error("Не удалось обновить комментарий"),
  });
};
