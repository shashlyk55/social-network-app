import { AuthResponseDto, LoginCredentials } from "@/types/auth";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { useRouter } from "next/navigation";
import { ApiError, AuthErrorResponse } from "@/types/errors";
import { authService } from "@/services/auth.service";
import { apiClient } from "@/lib/api-client";

export const useLogin = () => {
  const router = useRouter();
  const queryClient = useQueryClient();

  return useMutation<
    undefined,
    AxiosError<AuthErrorResponse>,
    LoginCredentials
  >({
    mutationFn: (data: LoginCredentials) => authService.login(data),

    onSuccess: async () => {
      try {
        // Запрашиваем данные текущего пользователя вторым запросом
        const { data: user } = await apiClient.get("/auth/me");

        // Обновляем глобальный кэш React Query, чтобы Navbar и другие компоненты
        // сразу увидели пользователя без лишних загрузок
        queryClient.setQueryData(["me"], user);

        // Теперь у нас есть username для формирования динамического пути
        router.push(`/profile/${user.username}`);

        // Принудительно уведомляем серверные компоненты об изменении кук
        router.refresh();
      } catch (error) {
        console.error("Ошибка при получении профиля после входа:", error);
        // Если профиль не удалось получить, можно отправить на общую страницу
        router.push("/feed");
      }

      // router.replace("/profile");
      // router.refresh();
    },

    onError: (error: ApiError) => {
      const errorMessage =
        error.response?.data?.error?.message ||
        error.response?.data?.message ||
        "Registration error";
      alert(errorMessage);
    },
  });
};
