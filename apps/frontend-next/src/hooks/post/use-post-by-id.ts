import { useQuery } from "@tanstack/react-query";
import { PostService } from "@/services/post.service";

export const usePostById = (postId: number) => {
  return useQuery({
    queryKey: ["posts", "detail", postId],
    queryFn: () => PostService.findOne(postId),
    enabled: !!postId,
    staleTime: 1000 * 60 * 5,
  });
};
