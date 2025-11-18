import { Notification } from 'src/entities/notification.entity';
import {
  CreateNotificationParams,
  UpdateNotificationParams,
  FindNotificationsParams,
  MarkAsReadParams,
  MarkAllAsReadParams,
  NotificationPaginationResult,
} from '../types/notification-service.types';

export interface INotificationsService {
  create(params: CreateNotificationParams): Promise<Notification>;
  findAll(
    params: FindNotificationsParams,
  ): Promise<NotificationPaginationResult>;
  findOne(id: number): Promise<Notification>;
  update(params: UpdateNotificationParams): Promise<Notification>;
  remove(id: number, deletedById: number): Promise<void>;
  markAsRead(params: MarkAsReadParams): Promise<Notification>;
  markAllAsRead(params: MarkAllAsReadParams): Promise<{ affected: number }>;
  getUserNotifications(
    createdById: number,
    params: FindNotificationsParams,
  ): Promise<NotificationPaginationResult>;
  getUnreadCount(createdById: number): Promise<number>;
}
