import { PostService } from "@/services/post.service";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const useToggleArchive = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (postId: number) => PostService.toggleArchive(postId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["posts"] });
    },
  });
};
