import { Inject, Injectable } from '@nestjs/common';
import { ProcessNotificationParams } from './types/params.types';
import { Repository } from 'typeorm';
import { Notification } from '../entities/notification.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { UserNotification } from '../entities/user-notifications.entity';
import { ClientProxy } from '@nestjs/microservices';

@Injectable()
export class NotificationsConsumerService {
  constructor(
    @InjectRepository(Notification)
    private readonly notificationsRepository: Repository<Notification>,
    @InjectRepository(UserNotification)
    private readonly userNotificationsRepository: Repository<UserNotification>,
    @Inject('REDIS_SERVICE')
    private readonly redisClient: ClientProxy,
  ) {}

  async processNotification(params: ProcessNotificationParams) {
    console.log(params);

    const notification = this.notificationsRepository.create({
      data: params.data,
      message: params.message,
      createdById: params.senderId,
      type: params.type,
      title: params.title,
      createdAt: new Date(),
    });

    const savedNotification =
      await this.notificationsRepository.save(notification);

    console.log(savedNotification);

    const userNotifications = params.recipientIds.map((recipientId) => ({
      recipientId: recipientId,
      notificationId: savedNotification.id,
    }));

    await this.userNotificationsRepository.insert(userNotifications);

    for (const recipientId of params.recipientIds) {
      this.redisClient.emit('rt_notification_channel', {
        recipientId: recipientId,
        notification: {
          id: savedNotification.id,
          type: savedNotification.type,
          title: savedNotification.title,
          message: savedNotification.message,
          data: savedNotification.data,
          createdAt: savedNotification.createdAt,
        },
      });
    }

    console.log(`Notification ${savedNotification.id} sended to redis`);
  }
}
