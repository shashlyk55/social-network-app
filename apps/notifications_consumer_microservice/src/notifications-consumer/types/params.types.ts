import { NotificationType } from '@/entities/notification.entity';

export type ProcessNotificationParams = {
  recipientIds: number[];
  senderId: number;
  type: NotificationType;
  title: string;
  message: string;
  data?: Record<string, unknown> | null;
};
