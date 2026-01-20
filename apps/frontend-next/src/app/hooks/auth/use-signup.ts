import { useRouter } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import { AuthResponseDto, SignupCredentials } from "@/types/auth";
import { authService } from "@/services/auth.service";
import { AxiosError } from "axios";
import { ApiError, AuthErrorResponse } from "@/types/errors";

export const useSignup = () => {
  const router = useRouter();

  return useMutation<
    AuthResponseDto,
    AxiosError<AuthErrorResponse>,
    SignupCredentials
  >({
    mutationFn: (data: SignupCredentials) => authService.signup(data),

    onSuccess: () => {
      router.replace("/feed");
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
