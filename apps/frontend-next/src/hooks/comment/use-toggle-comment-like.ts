import { useMutation, useQueryClient } from "@tanstack/react-query";
import { CommentService } from "@/services/comment.service";
import { CommentLike, CommentView } from "@/types/comment";
import { PaginatedData } from "@/types/pagination";
import { toast } from "sonner";

export const useToggleCommentLike = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (commentId: number) =>
      CommentService.toggleCommentLike(commentId),

    onMutate: async (commentId) => {
      await queryClient.cancelQueries({ queryKey: ["comments"] });

      const previousCommentsData = queryClient.getQueriesData({
        queryKey: ["comments"],
      });

      const updateComment = (comment: CommentView) => ({
        ...comment,
        isLiked: !comment.isLiked,
        likesCount: comment.isLiked
          ? Math.max(0, comment.likesCount - 1)
          : comment.likesCount + 1,
      });

      queryClient.setQueriesData(
        { queryKey: ["comments"] },
        (old: PaginatedData<CommentView> | undefined) => {
          if (!old || !old.data) return old;
          return {
            ...old,
            data: old.data.map((c) =>
              c.id === commentId ? updateComment(c) : c
            ),
          };
        }
      );

      return { previousCommentsData };
    },

    onSuccess: (serverData: CommentLike, commentId) => {
      queryClient.setQueriesData(
        { queryKey: ["comments"] },
        (old: PaginatedData<CommentView> | undefined) => {
          if (!old || !old.data) return old;
          return {
            ...old,
            data: old.data.map((c) =>
              c.id === commentId
                ? {
                    ...c,
                    isLiked: serverData.isLiked,
                    likesCount: serverData.likesCount,
                  }
                : c
            ),
          };
        }
      );
    },

    onError: (err, variables, context) => {
      if (context?.previousCommentsData) {
        context.previousCommentsData.forEach(([queryKey, oldData]) => {
          queryClient.setQueryData(queryKey, oldData);
        });
      }
      toast.error("Failed to update like");
    },
  });
};
