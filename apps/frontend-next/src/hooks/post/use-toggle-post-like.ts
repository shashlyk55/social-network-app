import { useMutation, useQueryClient } from "@tanstack/react-query";
import { PostService } from "@/services/post.service";
import { PostView } from "@/types/post";
import { PaginatedData } from "@/types/pagination";

export const useTogglePostLike = (postId: number) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => PostService.togglePostLike(postId),

    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: ["profile-posts"] });
      const previousPosts = queryClient.getQueryData(["profile-posts"]);

      queryClient.setQueriesData(
        { queryKey: ["profile-posts"] },
        (old: PaginatedData<PostView>) => {
          if (!old) return old;
          return {
            ...old,
            data: old.data.map((post: PostView) => {
              if (post.id === postId) {
                return {
                  ...post,
                  isLiked: !post.isLiked,
                  likesCount: post.isLiked
                    ? post.likesCount - 1
                    : post.likesCount + 1,
                };
              }
              return post;
            }),
          };
        }
      );

      return { previousPosts };
    },

    onError: (err, variables, context) => {
      if (context?.previousPosts) {
        queryClient.setQueryData(["profile-posts"], context.previousPosts);
      }
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["profile-posts"] });
    },
  });
};
