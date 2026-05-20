import { useMutation, useQueryClient } from "@tanstack/react-query";
import { PostService } from "@/services/post.service";
import { PostView, UpdatePost } from "@/types/post";
import { toast } from "sonner";
import { PaginatedData } from "@/types/pagination";

export const useUpdatePost = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ postId, data }: { postId: number; data: UpdatePost }) =>
      PostService.update(postId, data),
    onSuccess: (updatedPost) => {
      toast.success("Post updated");

      queryClient.setQueryData(["post", updatedPost.id], updatedPost);

      queryClient.setQueriesData(
        { queryKey: ["profile-posts"] },
        (oldData: PaginatedData<PostView>) => {
          if (!oldData) return oldData;

          return {
            ...oldData,
            data: oldData.data.map((post: PostView) =>
              post.id === updatedPost.id ? updatedPost : post
            ),
          };
        }
      );
    },
    onError: () => {
      toast.error("Failed to update post");
    },
  });
};
