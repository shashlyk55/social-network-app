import { LoginCredentials } from "@/types/auth";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { useRouter } from "next/navigation";
import { AuthErrorResponse } from "@/types/errors";
import { authService } from "@/services/auth.service";
import { ProfileService } from "@/services/profile.service";

export const useLogin = () => {
  const router = useRouter();
  const queryClient = useQueryClient();

  return useMutation<void, AxiosError<AuthErrorResponse>, LoginCredentials>({
    mutationFn: (data: LoginCredentials) => authService.login(data),

    onSuccess: async () => {
      try {
        const userProfile = await ProfileService.getMe();
        queryClient.setQueryData(["me"], userProfile);

        router.push("/profiles/me");
        router.refresh();
      } catch (error) {
        console.error("Ошибка при получении профиля после входа:", error);
        router.push("/feed");
      }
    },

    onError: (error) => {
      const errorMessage =
        error.response?.data?.error?.message ||
        error.response?.data?.message ||
        "Ошибка авторизации";

      alert(errorMessage);
    },
  });
};
