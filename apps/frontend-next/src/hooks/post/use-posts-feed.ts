import { PostService } from "@/services/post.service";
import { useInfiniteQuery } from "@tanstack/react-query";

export const usePostsFeed = (limit: number = 10) => {
  return useInfiniteQuery({
    queryKey: ["posts", "feed", limit],
    queryFn: ({ pageParam = 1 }) =>
      PostService.getFeed({ page: pageParam, limit }),
    getNextPageParam: (lastPage) => {
      const { page, totalPages } = lastPage.meta;
      if (page < totalPages) {
        return page + 1;
      }
      return undefined;
    },
    initialPageParam: 1,
    staleTime: 1000 * 60 * 5,
    refetchOnWindowFocus: false,
  });
};
