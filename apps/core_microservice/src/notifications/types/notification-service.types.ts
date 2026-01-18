import { NotificationType } from 'src/common/types/notification-type';

export type FindNotificationsParams = {
  page?: number;
  limit?: number;
  type?: NotificationType;
  isRead?: boolean;
  createdById?: number;
};

// export type NotificationPaginationResult = {
//   data: Notification[];
//   total: number;
//   page: number;
//   limit: number;
//   totalPages: number;
// };
