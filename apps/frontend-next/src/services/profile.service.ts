import { apiClient } from "@/lib/api-client";
import {
  MyProfile,
  OtherProfile,
  ProfilePreview,
  UpdateProfileInput,
} from "@/types/profile";

export const ProfileService = {
  async getMe(): Promise<MyProfile> {
    const { data } = await apiClient.get<MyProfile>("/profiles/me");
    return data;
  },

  async getById(id: number): Promise<OtherProfile> {
    const { data } = await apiClient.get<OtherProfile>(`/profiles/${id}`);
    return data;
  },

  async updateMyProfile(updateData: UpdateProfileInput): Promise<MyProfile> {
    const { data } = await apiClient.patch<MyProfile>("/profiles", updateData);
    return data;
  },

  searchProfiles: async (query: string): Promise<ProfilePreview[]> => {
    const { data } = await apiClient.get<ProfilePreview[]>(`/profiles/search`, {
      params: { query },
    });
    console.log(data);

    return data;
  },
};
