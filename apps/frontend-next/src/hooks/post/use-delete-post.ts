import { PostService } from "@/services/post.service";
import { PaginatedData } from "@/types/pagination";
import { PostView } from "@/types/post";
import { MyProfile } from "@/types/profile";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export const useDeletePost = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (postId: number) => PostService.delete(postId),
    onSuccess: (_, postId) => {
      toast.success("Post deleted");
      queryClient.setQueriesData(
        { queryKey: ["profile-posts"] },
        (oldData: PaginatedData<PostView>) => {
          if (!oldData) return oldData;

          return {
            ...oldData,
            data: oldData.data.filter((post: PostView) => post.id !== postId),
          };
        }
      );

      queryClient.setQueryData(
        ["me"],
        (oldMe: MyProfile | null | undefined) => {
          if (!oldMe) return oldMe;
          return {
            ...oldMe,
            postsCount: Math.max(0, (oldMe.postsCount || 0) - 1),
          };
        }
      );
    },
    onError: () => {
      toast.error("Failed to delete post");
    },
  });
};
