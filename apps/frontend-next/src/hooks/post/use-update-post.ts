import { useMutation, useQueryClient } from "@tanstack/react-query";
import { PostService } from "@/services/post.service";
import { UpdatePost } from "@/types/post";
import { toast } from "sonner";

export const useUpdatePost = (postId: number) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: UpdatePost) => PostService.update(postId, data),
    onSuccess: () => {
      toast.success("Post updated");
      queryClient.invalidateQueries({ queryKey: ["profile-posts"] });
    },
    onError: () => {
      toast.error("Failed to update post");
    },
  });
};
