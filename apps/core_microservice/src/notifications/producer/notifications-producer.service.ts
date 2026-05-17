import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import {
  NotificationType,
  NotificationTitleTemplates,
} from 'src/common/types/notification-type';

interface NotificationMessage {
  recipientIds: number[];
  senderId: number;
  type: NotificationType;
  title?: string;
  message: string;
  data?: Record<string, unknown> | null;
}

@Injectable()
export class NotificationsProducerService {
  constructor(
    @Inject('NOTIFICATION_SERVICE')
    private readonly client: ClientProxy,
  ) {}

  private async emitNotification(data: NotificationMessage) {
    return this.client.emit('notification_created', {
      ...data,
      createdById: data.senderId,
    });
  }

  async emitPostLikeNotification(data: Omit<NotificationMessage, 'type'>) {
    return this.emitNotification({
      ...data,
      type: NotificationType.POST_LIKE,
      title:
        data.title || NotificationTitleTemplates[NotificationType.POST_LIKE],
    });
  }

  async emitNewCommentNotification(data: Omit<NotificationMessage, 'type'>) {
    return this.emitNotification({
      ...data,
      type: NotificationType.NEW_COMMENT,
      title:
        data.title || NotificationTitleTemplates[NotificationType.NEW_COMMENT],
    });
  }

  async emitCommentLikeNotification(data: Omit<NotificationMessage, 'type'>) {
    return this.emitNotification({
      ...data,
      type: NotificationType.COMMENT_LIKE,
      title:
        data.title || NotificationTitleTemplates[NotificationType.COMMENT_LIKE],
    });
  }

  async emitCommentReplyNotification(data: Omit<NotificationMessage, 'type'>) {
    return this.emitNotification({
      ...data,
      type: NotificationType.COMMENT_REPLY,
      title:
        data.title ||
        NotificationTitleTemplates[NotificationType.COMMENT_REPLY],
    });
  }

  async emitFollowRequestNotification(data: Omit<NotificationMessage, 'type'>) {
    return this.emitNotification({
      ...data,
      type: NotificationType.FOLLOW_REQUEST,
      title:
        data.title ||
        NotificationTitleTemplates[NotificationType.FOLLOW_REQUEST],
    });
  }

  async emitAcceptFollowRequestNotification(
    data: Omit<NotificationMessage, 'type'>,
  ) {
    return this.emitNotification({
      ...data,
      type: NotificationType.ACCEPT_FOLLOW_REQUEST,
      title:
        data.title ||
        NotificationTitleTemplates[NotificationType.ACCEPT_FOLLOW_REQUEST],
    });
  }

  async emitDeclineFollowRequestNotification(
    data: Omit<NotificationMessage, 'type'>,
  ) {
    return this.emitNotification({
      ...data,
      type: NotificationType.DECLINE_FOLLOW_REQUEST,
      title:
        data.title ||
        NotificationTitleTemplates[NotificationType.DECLINE_FOLLOW_REQUEST],
    });
  }

  async emitSystemNotification(data: Omit<NotificationMessage, 'type'>) {
    return this.emitNotification({
      ...data,
      type: NotificationType.SYSTEM,
      title: data.title || NotificationTitleTemplates[NotificationType.SYSTEM],
    });
  }
}
