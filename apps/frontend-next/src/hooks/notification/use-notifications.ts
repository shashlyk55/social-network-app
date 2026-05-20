import { useQuery } from "@tanstack/react-query";
import { NotificationService } from "@/services/notification.service";
import { FindNotificationsParams } from "@/types/notification";

export const useNotifications = (params: FindNotificationsParams = {}) => {
  const normalizedParams = {
    page: params.page ?? 1,
    limit: params.limit ?? 20,
    isRead: params.isRead,
    type: params.type,
  };

  return useQuery({
    queryKey: ["notifications", normalizedParams],
    queryFn: () => NotificationService.getAll(normalizedParams),
    staleTime: 1000 * 30,
  });
};
