import { useMutation, useQueryClient } from "@tanstack/react-query";
import { PostService } from "@/services/post.service";
import { CreatePost, PostView } from "@/types/post";
import { toast } from "sonner";
import { PaginatedData } from "@/types/pagination";
import { MyProfile } from "@/types/profile";

export const useCreatePost = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreatePost) => PostService.create(data),
    onSuccess: (newPost) => {
      toast.success("Post created");

      queryClient.setQueriesData(
        { queryKey: ["profile-posts"] },
        (oldData: PaginatedData<PostView>) => {
          if (!oldData) return oldData;

          return {
            ...oldData,
            data: [newPost, ...oldData.data],
          };
        }
      );

      queryClient.setQueryData(
        ["me"],
        (oldMe: MyProfile | null | undefined) => {
          if (!oldMe) return oldMe;
          return {
            ...oldMe,
            postsCount: (oldMe.postsCount || 0) + 1,
          };
        }
      );
    },
    onError: () => {
      toast.error("Failed to create post");
    },
  });
};
