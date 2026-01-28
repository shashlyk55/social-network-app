import { useMutation, useQueryClient } from "@tanstack/react-query";
import { PostService } from "@/services/post.service";

export const useToggleArchive = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (postId: number) => PostService.toggleArchive(postId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["profile-posts"] });
      queryClient.invalidateQueries({ queryKey: ["me"] });
    },
  });
};
