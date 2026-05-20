import { apiClient } from "@/lib/api-client";
import {
  FindNotificationsParams,
  NotificationsResponse,
} from "@/types/notification";

export const NotificationService = {
  async getAll(
    params: FindNotificationsParams = {}
  ): Promise<NotificationsResponse> {
    const { data } = await apiClient.get<NotificationsResponse>(
      "/notifications",
      {
        params,
      }
    );

    return data;
  },
};
