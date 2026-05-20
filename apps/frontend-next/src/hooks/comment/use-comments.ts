import { useQuery } from "@tanstack/react-query";
import { FindCommentsParams } from "@/types/comment";
import { CommentService } from "@/services/comment.service";

export const useComments = (params: FindCommentsParams) => {
  return useQuery({
    queryKey: ["comments", params.postId, params.parentCommentId ?? null],
    queryFn: () => CommentService.findAll(params),
    enabled: !!params.postId || params.parentCommentId !== undefined,
    staleTime: 5000 * 60,
  });
};
