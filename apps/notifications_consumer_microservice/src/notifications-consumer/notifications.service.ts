import { Inject, Injectable } from '@nestjs/common';
import {
  FindNotificationsParams,
  ProcessNotificationParams,
} from './types/params.types';
import { Repository } from 'typeorm';
import { Notification } from '../entities/notification.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { UserNotification } from '../entities/user-notifications.entity';
import { ClientProxy } from '@nestjs/microservices';
import { PaginatedData } from '@/common/types/paginated-data';

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

  async findAll(
    params: FindNotificationsParams,
  ): Promise<PaginatedData<UserNotification>> {
    const { recipientId, page = 1, limit = 20, type, isRead } = params;

    const skip = (page - 1) * limit;

    const queryBuilder = this.userNotificationsRepository
      .createQueryBuilder('userNotification')
      .leftJoinAndSelect('userNotification.notification', 'notification')
      .where('userNotification.recipient_id = :recipientId', { recipientId });

    if (type) {
      queryBuilder.andWhere('notification.type = :type', { type });
    }

    if (typeof isRead === 'boolean') {
      queryBuilder.andWhere('userNotification.is_read = :isRead', { isRead });
    }

    const [data, total] = await queryBuilder
      .orderBy('notification.createdAt', 'DESC')
      .skip(skip)
      .take(limit)
      .getManyAndCount();

    return {
      data,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }
}
