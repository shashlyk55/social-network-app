import { useRouter } from "next/navigation";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { SignupCredentials } from "@/types/auth";
import { authService } from "@/services/auth.service";
import { AxiosError } from "axios";
import { ApiError, AuthErrorResponse } from "@/types/errors";
import { toast } from "sonner";
import { ProfileService } from "@/services/profile.service";

export const useSignup = () => {
  const router = useRouter();
  const queryClient = useQueryClient();

  return useMutation<void, AxiosError<AuthErrorResponse>, SignupCredentials>({
    mutationFn: (data: SignupCredentials) => authService.signup(data),

    onSuccess: async () => {
      try {
        const userProfile = await ProfileService.getMe();
        queryClient.setQueryData(["me"], userProfile);

        router.push("/profile/me");
        router.refresh();
      } catch (error) {
        console.error("Ошибка при получении профиля после входа:", error);
        router.push("/feed");
      }
    },

    onError: (error: ApiError) => {
      const errorMessage =
        error.response?.data?.error?.message ||
        error.response?.data?.message ||
        "Registration error";
      toast.error(errorMessage, { id: "signup" });
    },
  });
};
