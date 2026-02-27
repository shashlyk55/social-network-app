import { PostService } from "@/services/post.service";
import { PaginatedData } from "@/types/pagination";
import { PostView } from "@/types/post";
import { MyProfile } from "@/types/profile";
import {
  InfiniteData,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { toast } from "sonner";

export const useDeletePost = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (postId: number) => PostService.delete(postId),
    onSuccess: (_, postId) => {
      toast.success("Post deleted");

      queryClient.invalidateQueries({
        queryKey: ["posts"],
      });

      queryClient.setQueryData(
        ["me"],
        (oldMe: MyProfile | null | undefined) => {
          if (!oldMe) return oldMe;
          return {
            ...oldMe,
            postsCount: Math.max(0, Number(oldMe.postsCount || 0) - 1),
          };
        }
      );

      queryClient.removeQueries({ queryKey: ["posts", "detail", postId] });
    },
    onError: () => {
      toast.error("Failed to delete post");
    },
  });
};
