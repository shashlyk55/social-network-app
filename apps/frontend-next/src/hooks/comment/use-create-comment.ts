import { useMutation, useQueryClient } from "@tanstack/react-query";
import { CommentService } from "@/services/comment.service";
import { CommentView, CreateComment } from "@/types/comment";
import { toast } from "sonner";
import { PaginatedData } from "@/types/pagination";
import { PostView } from "@/types/post";

export const useCreateComment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateComment) => CommentService.create(data),
    onSuccess: (newComment) => {
      const { postId, parentCommentId } = newComment;
      const commentKey = ["comments", postId, parentCommentId ?? null];

      queryClient.setQueryData(
        commentKey,
        (oldData: PaginatedData<CommentView>) => {
          if (!oldData) return oldData;
          return {
            ...oldData,
            data: [newComment, ...oldData.data],
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
                      repliesCount: Number(comment.repliesCount || 0) + 1,
                    }
                  : comment
              ),
            };
          }
        );
      }

      queryClient.setQueryData(
        ["posts", "detail", postId],
        (oldPost: PostView): PostView => {
          return {
            ...oldPost,
            commentsCount: Number(oldPost.commentsCount || 0) + 1,
          };
        }
      );

      toast.success("Comment added!");
    },
    onError: () => {
      toast.error("Failed to post comment");
    },
  });
};
