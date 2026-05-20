import { ProfileService } from "@/services/profile.service";
import { useQuery } from "@tanstack/react-query";

export const useProfileById = (id: number) => {
  return useQuery({
    queryKey: ["profile", id],
    queryFn: () => ProfileService.getById(id),
    enabled: !!id,
  });
};
