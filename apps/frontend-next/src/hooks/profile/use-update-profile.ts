import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ProfileService } from "@/services/profile.service";
import { toast } from "sonner";
import { ApiError } from "@/types/errors";
import { UpdateProfileInput } from "@/types/profile";

export const useUpdateProfile = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: UpdateProfileInput) =>
      ProfileService.updateMyProfile(data),

    onMutate: () => {
      toast.loading("Editing...", { id: "update-profile" });
    },

    onSuccess: (updatedProfile) => {
      queryClient.setQueryData(["me"], updatedProfile);
      queryClient.invalidateQueries({ queryKey: ["profile-posts"] });
      toast.success("Profile edited!", { id: "update-profile" });
    },

    onError: (error: ApiError) => {
      const errorMessage =
        error.response?.data?.error?.message ||
        error.response?.data?.message ||
        "Update error";
      toast.error(errorMessage, { id: "update-profile" });
    },
  });
};
