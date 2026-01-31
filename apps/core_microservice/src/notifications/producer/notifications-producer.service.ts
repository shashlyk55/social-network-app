import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { NotificationType } from 'src/common/types/notification-type';

interface NotificationMessage {
  recipientIds: number[];
  senderId: number;
  type: NotificationType;
  title: string;
  message: string;
  data?: Record<string, unknown> | null;
}

@Injectable()
export class NotificationsProducerService {
  constructor(
    @Inject('NOTIFICATION_SERVICE')
    private readonly client: ClientProxy,
  ) {}

  async emitNotification(data: NotificationMessage) {
    return this.client.emit('notification_created', {
      ...data,
      createdById: data.senderId,
    });
  }
}
