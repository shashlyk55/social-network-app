import {
  Notification,
  NotificationType,
} from 'src/entities/notification.entity';

export type CreateNotificationParams = {
  type: NotificationType;
  title: string;
  message: string;
  data?: any;
  createdById: number;
};

export type UpdateNotificationParams = {
  id: number;
  isRead?: boolean;
  updatedById?: number;
};

export type FindNotificationsParams = {
  page?: number;
  limit?: number;
  type?: NotificationType;
  isRead?: boolean;
  createdById?: number;
};

export type MarkAsReadParams = {
  id: number;
  isRead?: boolean;
  updatedById?: number;
};

export type MarkAllAsReadParams = {
  createdById: number;
  updatedById?: number;
};

export type NotificationPaginationResult = {
  data: Notification[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
};
