import { useMutation, useQueryClient } from "@tanstack/react-query";
import { PostService } from "@/services/post.service";
import { CreatePost } from "@/types/post";
import { toast } from "sonner";
import { MyProfile } from "@/types/profile";

export const useCreatePost = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreatePost) => PostService.create(data),
    onSuccess: () => {
      toast.success("Post created");

      queryClient.invalidateQueries({
        queryKey: ["posts"],
      });

      queryClient.setQueryData(
        ["me"],
        (oldMe: MyProfile | null | undefined) => {
          if (!oldMe) return oldMe;
          return { ...oldMe, postsCount: Number(oldMe.postsCount || 0) + 1 };
        }
      );
    },
    onError: () => {
      toast.error("Failed to create post");
    },
  });
};
