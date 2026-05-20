import { useRouter } from "next/navigation";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { authService } from "@/services/auth.service";

export const useLogout = () => {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: () => authService.logout(),
    onSuccess: () => {
      queryClient.clear();
      router.push("/login");
      router.refresh();
    },
  });
};
