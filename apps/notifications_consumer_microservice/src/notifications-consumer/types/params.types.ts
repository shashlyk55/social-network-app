import { NotificationType } from '@/entities/notification.entity';

export type ProcessNotificationParams = {
  recipientIds: number[];
  senderId: number;
  type: NotificationType;
  title: string;
  message: string;
  data?: Record<string, unknown> | null;
};

export type FindNotificationsParams = {
  recipientId: number;
  page?: number;
  limit?: number;
  type?: NotificationType;
  isRead?: boolean;
};

export type NotificationListItem = {
  id: number;
  type: NotificationType;
  title: string;
  message: string;
  data: Record<string, unknown> | null;
  isRead: boolean;
  readAt: Date | null;
  createdAt: Date;
};

export type NotificationsListResult = {
  data: NotificationListItem[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
};
