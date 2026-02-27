import {
  useMutation,
  useQueryClient,
  InfiniteData,
  QueryClient,
} from "@tanstack/react-query";
import { PostService } from "@/services/post.service";
import { PostLike, PostView } from "@/types/post";
import { PaginatedData } from "@/types/pagination";
import { toast } from "sonner";

function updateCache(
  queryClient: QueryClient,
  postId: number,
  updateFn: (p: PostView) => PostView
) {
  queryClient.setQueriesData<PostView | InfiniteData<PaginatedData<PostView>>>(
    { queryKey: ["posts"] },
    (old) => {
      if (!old) return old;

      if ("pages" in old) {
        return {
          ...old,
          pages: old.pages.map((page) => ({
            ...page,
            data: page.data.map((p) => (p.id === postId ? updateFn(p) : p)),
          })),
        };
      }

      if ("id" in old && old.id === postId) {
        return updateFn(old);
      }

      return old;
    }
  );
}

export const useTogglePostLike = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (postId: number) => PostService.togglePostLike(postId),
    onMutate: async (postId) => {
      await queryClient.cancelQueries({ queryKey: ["posts"] });
      const previousQueries = queryClient.getQueriesData({
        queryKey: ["posts"],
      });

      const optimisticUpdate = (p: PostView): PostView => ({
        ...p,
        isLiked: !p.isLiked,
        likesCount: p.isLiked
          ? Math.max(0, Number(p.likesCount) - 1)
          : Number(p.likesCount) + 1,
      });

      updateCache(queryClient, postId, optimisticUpdate);
      return { previousQueries };
    },

    onSuccess: (serverData: PostLike) => {
      const finalUpdate = (p: PostView): PostView => ({
        ...p,
        isLiked: serverData.isLiked,
        likesCount: serverData.likesCount,
      });

      updateCache(queryClient, serverData.postId, finalUpdate);
    },
    onError: (err, postId, context) => {
      if (context?.previousQueries) {
        context.previousQueries.forEach(([key, value]) => {
          queryClient.setQueryData(key, value);
        });
        toast.error("Failed to like");
      }
    },
  });
};
