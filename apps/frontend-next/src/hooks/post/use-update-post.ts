import { useMutation, useQueryClient } from "@tanstack/react-query";
import { PostService } from "@/services/post.service";
import { PostCache, UpdatePost } from "@/types/post";
import { toast } from "sonner";

export const useUpdatePost = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ postId, data }: { postId: number; data: UpdatePost }) =>
      PostService.update(postId, data),
    onSuccess: (updatedPost) => {
      queryClient.setQueriesData<PostCache>({ queryKey: ["posts"] }, (old) => {
        if (!old) return old;

        if ("pages" in old) {
          return {
            ...old,
            pages: old.pages.map((page) => ({
              ...page,
              data: page.data.map((p) =>
                p.id === updatedPost.id ? updatedPost : p
              ),
            })),
          };
        }

        if ("id" in old && old.id === updatedPost.id) {
          return updatedPost;
        }

        return old;
      });
    },
    onError: () => {
      toast.error("Failed to update post");
    },
  });
};
