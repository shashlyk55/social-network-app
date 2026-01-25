import { useQuery } from "@tanstack/react-query";
import { FollowService } from "@/services/follow.service";
import { FollowDirection } from "@/types/profile";

export const useFollows = (
  direction: FollowDirection,
  profileId?: number,
  page: number = 1
) => {
  return useQuery({
    queryKey: ["follows", profileId, direction, page],
    queryFn: () => FollowService.getFollows(profileId!, direction, page),

    enabled: !!profileId,
    placeholderData: (previousData) => previousData,
    staleTime: 1000 * 60 * 5,
  });
};
