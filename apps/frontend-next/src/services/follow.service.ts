import { apiClient } from "@/lib/api-client";
import { PaginatedData } from "@/types/pagination";
import { FollowDirection, ProfilePreview } from "@/types/profile";

export const FollowService = {
  follow: async (targetProfileId: number) => {
    const response = await apiClient.post(`/follow/${targetProfileId}`);
    return response.data;
  },

  unfollow: async (targetProfileId: number) => {
    const response = await apiClient.delete(`/follow/${targetProfileId}`);
    return response.data;
  },

  async getFollows(
    profileId: number,
    direction: FollowDirection,
    page: number = 1,
    limit: number = 20
  ): Promise<PaginatedData<ProfilePreview>> {
    const { data } = await apiClient.get<PaginatedData<ProfilePreview>>(
      `/follow/${profileId}/${direction}`,
      {
        params: { page, limit },
      }
    );
    return data;
  },
};
