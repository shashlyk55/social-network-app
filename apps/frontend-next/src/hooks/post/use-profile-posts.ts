import { PostService } from "@/services/post.service";
import { FindPostsParams } from "@/types/post";
import { useInfiniteQuery } from "@tanstack/react-query";

export const useProfilePosts = ({
  limit = 10,
  ...params
}: FindPostsParams & { limit: number }) => {
  return useInfiniteQuery({
    queryKey: [
      "posts",
      "profile",
      params.authorProfileId,
      { isArchived: params.isArchived, limit },
    ],
    queryFn: ({ pageParam = 1 }) =>
      PostService.findAll({
        ...params,
        page: pageParam as number,
        limit,
      }),
    getNextPageParam: (lastPage) => {
      const { page, totalPages } = lastPage.meta;
      return page < totalPages ? page + 1 : undefined;
    },
    initialPageParam: 1,
    enabled: !!params.authorProfileId,
    staleTime: 1000 * 60 * 5,
  });
};
