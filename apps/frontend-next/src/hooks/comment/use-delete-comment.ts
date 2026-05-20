import { useMutation, useQueryClient } from "@tanstack/react-query";
import { CommentService } from "@/services/comment.service";
import { toast } from "sonner";
import { PaginatedData } from "@/types/pagination";
import { CommentView } from "@/types/comment";
import { PostView } from "@/types/post";

export const useDeleteComment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      commentId,
    }: {
      commentId: number;
      postId: number;
      parentCommentId?: number | null;
    }) => CommentService.delete(commentId),

    onSuccess: (_, variables) => {
      const { commentId, postId, parentCommentId } = variables;
      toast.success("Comment deleted!");

      queryClient.setQueriesData(
        { queryKey: ["comments"] },
        (oldData: PaginatedData<CommentView> | undefined) => {
          if (!oldData || !oldData.data) return oldData;

          return {
            ...oldData,
            data: oldData.data.filter(
              (comment: CommentView) => comment.id !== commentId
            ),
          };
        }
      );

      if (parentCommentId) {
        queryClient.setQueriesData(
          { queryKey: ["comments", postId] },
          (oldData: PaginatedData<CommentView> | undefined) => {
            if (!oldData || !oldData.data) return oldData;
            return {
              ...oldData,
              data: oldData.data.map((comment) =>
                comment.id === parentCommentId
                  ? {
                      ...comment,
                      repliesCount: Math.max(
                        0,
                        (comment.repliesCount || 0) - 1
                      ),
                    }
                  : comment
              ),
            };
          }
        );
      }

      queryClient.setQueryData(
        ["post", postId],
        (oldPost: PostView | undefined) => {
          if (!oldPost) return oldPost;

          return {
            ...oldPost,
            commentsCount: Math.max(0, (oldPost.commentsCount || 0) - 1),
          };
        }
      );
    },
    onError: () => {
      toast.error("Failed to delete comment!");
    },
  });
};
