import { PostService } from "@/services/post.service";
import { FindPostsParams } from "@/types/post";
import { useQuery } from "@tanstack/react-query";

export const useProfilePosts = (params: FindPostsParams) => {
  return useQuery({
    queryKey: ["profile-posts", params.authorProfileId, params.isArchived],
    queryFn: () => PostService.findAll(params),
    enabled: !!params.authorProfileId,
    staleTime: 1000 * 60 * 5,
  });
};
