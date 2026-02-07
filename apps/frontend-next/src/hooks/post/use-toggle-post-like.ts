import {
  InfiniteData,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { PostService } from "@/services/post.service";
import { PostLike, PostView } from "@/types/post";
import { PaginatedData } from "@/types/pagination";

export const useTogglePostLike = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (postId: number) => PostService.togglePostLike(postId),

    onMutate: async (postId) => {
      await queryClient.cancelQueries({ queryKey: ["profile-posts"] });
      await queryClient.cancelQueries({ queryKey: ["post", postId] });
      await queryClient.cancelQueries({ queryKey: ["posts-feed"] });

      const previousPosts = queryClient.getQueryData(["profile-posts"]);
      const previousPostsFeed = queryClient.getQueryData(["posts-feed"]);
      const previousSinglePost = queryClient.getQueryData(["post", postId]);

      const updatePost = (post: PostView) => ({
        ...post,
        isLiked: !post.isLiked,
        likesCount: post.isLiked ? post.likesCount - 1 : post.likesCount + 1,
      });

      queryClient.setQueriesData(
        { queryKey: ["profile-posts"] },
        (old: PaginatedData<PostView> | undefined) => {
          if (!old) return old;
          return {
            ...old,
            data: old.data.map((p) => (p.id === postId ? updatePost(p) : p)),
          };
        }
      );

      queryClient.setQueryData(
        ["posts-feed"],
        (old: InfiniteData<PaginatedData<PostView>> | undefined) => {
          if (!old) return old;
          return {
            ...old,
            pages: old.pages.map((page) => ({
              ...page,
              data: page.data.map((p) => (p.id === postId ? updatePost(p) : p)),
            })),
          };
        }
      );

      queryClient.setQueryData(["post", postId], (old: PostView | undefined) =>
        old ? updatePost(old) : old
      );

      return { previousPosts, previousSinglePost, previousPostsFeed };
    },

    onSuccess: (serverData: PostLike, postId) => {
      const updateFromServer = (p: PostView) =>
        p.id === postId
          ? {
              ...p,
              isLiked: serverData.isLiked,
              likesCount: serverData.likesCount,
            }
          : p;

      queryClient.setQueryData(
        ["posts-feed"],
        (old: InfiniteData<PaginatedData<PostView>> | undefined) => {
          if (!old) return old;
          return {
            ...old,
            pages: old.pages.map((page) => ({
              ...page,
              data: page.data.map(updateFromServer),
            })),
          };
        }
      );

      queryClient.setQueryData(
        ["post", postId],
        (old: PostView | undefined) => {
          if (!old) return old;
          return {
            ...old,
            isLiked: serverData.isLiked,
            likesCount: serverData.likesCount,
          };
        }
      );

      queryClient.setQueriesData(
        { queryKey: ["profile-posts"] },
        (old: PaginatedData<PostView> | undefined) => {
          if (!old) return old;
          return {
            ...old,
            data: old.data.map((p) =>
              p.id === postId
                ? {
                    ...p,
                    isLiked: serverData.isLiked,
                    likesCount: serverData.likesCount,
                  }
                : p
            ),
          };
        }
      );
    },

    onError: (err, postId, context) => {
      if (context?.previousPosts)
        queryClient.setQueryData(["profile-posts"], context.previousPosts);
      if (context?.previousPostsFeed)
        queryClient.setQueryData(["posts-feed"], context.previousPostsFeed);
      if (context?.previousSinglePost)
        queryClient.setQueryData(["post", postId], context.previousSinglePost);
    },
  });
};
