import { useQuery } from "@tanstack/react-query";
import { MyProfile } from "@/types/profile";
import { ProfileService } from "@/services/profile.service";
import axios from "axios";

export const useMe = () => {
  return useQuery<MyProfile | null>({
    queryKey: ["me"],
    queryFn: async () => {
      try {
        return await ProfileService.getMe();
      } catch (error: unknown) {
        if (axios.isAxiosError(error)) {
          if (error.response?.status === 401) {
            return null;
          }
        }

        throw error;
      }
    },

    staleTime: 1000 * 60 * 5,
    retry: false,
  });
};
