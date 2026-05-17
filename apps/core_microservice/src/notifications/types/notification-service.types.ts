import { NotificationType } from 'src/common/types/notification-type';

export type FindNotificationsParams = {
  page?: number;
  limit?: number;
  isRead?: boolean;
  recipientId?: number;
};

export type NotificationResult = {
  id: number;
  type: NotificationType;
  title: string;
  message: string;
  data: any;
  isRead: boolean;
  readAt: Date | null;
  createdAt: Date;
};
