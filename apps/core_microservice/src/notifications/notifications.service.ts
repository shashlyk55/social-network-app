import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import {
  Notification,
  NotificationType,
} from '../entities/notification.entity';
import {
  CreateNotificationParams,
  FindNotificationsParams,
  NotificationPaginationResult,
  UpdateNotificationParams,
  MarkAsReadParams,
  MarkAllAsReadParams,
} from './types/notification-service.types';
import { INotificationsService } from './interfaces/INotificationsService';

@Injectable()
export class NotificationsService implements INotificationsService {
  constructor(
    @InjectRepository(Notification)
    private readonly notificationRepository: Repository<Notification>,
    private readonly dataSource: DataSource,
  ) {}

  async create(params: CreateNotificationParams): Promise<Notification> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const notification = this.notificationRepository.create({
        type: params.type,
        title: params.title,
        message: params.message,
        data: params.data,
        createdById: params.createdById,
      });

      const savedNotification = await queryRunner.manager.save(
        Notification,
        notification,
      );
      await queryRunner.commitTransaction();
      return await this.findOne(savedNotification.id);
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  async findAll(
    params: FindNotificationsParams,
  ): Promise<NotificationPaginationResult> {
    const { page = 1, limit = 10, type, isRead, createdById } = params;
    const skip = (page - 1) * limit;

    const queryBuilder = this.notificationRepository
      .createQueryBuilder('notification')
      .leftJoinAndSelect('notification.createdBy', 'createdBy')
      .leftJoinAndSelect('notification.updatedBy', 'updatedBy');

    if (type) {
      queryBuilder.andWhere('notification.type = :type', { type });
    }

    if (isRead !== undefined) {
      queryBuilder.andWhere('notification.isRead = :isRead', { isRead });
    }

    if (createdById) {
      queryBuilder.andWhere('notification.createdById = :createdById', {
        createdById,
      });
    }

    const [data, total] = await queryBuilder
      .skip(skip)
      .take(limit)
      .orderBy('notification.createdAt', 'DESC')
      .getManyAndCount();

    return {
      data,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async findOne(id: number): Promise<Notification> {
    const notification = await this.notificationRepository.findOne({
      where: { id },
      relations: ['createdBy', 'updatedBy'],
    });

    if (!notification) {
      throw new NotFoundException(`Notification with ID ${id} not found`);
    }

    return notification;
  }

  async update(params: UpdateNotificationParams): Promise<Notification> {
    const { id, ...updateData } = params;

    const notification = await this.findOne(id);

    if (!notification) {
      throw new NotFoundException('Notification not found');
    }

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const updatePayload: Partial<Notification> = {};
      if (updateData.isRead !== undefined) {
        updatePayload.isRead = updateData.isRead;
        updatePayload.readAt = updateData.isRead ? new Date() : undefined;
      }
      if (updateData.updatedById !== undefined)
        updatePayload.updatedById = updateData.updatedById;

      await queryRunner.manager.update(Notification, id, updatePayload);
      await queryRunner.commitTransaction();
      return await this.findOne(id);
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  async remove(id: number, deletedById: number): Promise<void> {
    const notification = await this.findOne(id);

    if (!notification) {
      throw new NotFoundException('Notification not found');
    }

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      await queryRunner.manager.delete(Notification, id);
      await queryRunner.commitTransaction();
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  async markAsRead(params: MarkAsReadParams): Promise<Notification> {
    const { id, isRead = true, updatedById } = params;

    const notification = await this.findOne(id);

    if (!notification) {
      throw new NotFoundException('Notification not found');
    }

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const updatePayload: Partial<Notification> = {
        isRead,
        readAt: isRead ? new Date() : undefined,
      };

      if (updatedById) {
        updatePayload.updatedById = updatedById;
      }

      await queryRunner.manager.update(Notification, id, updatePayload);
      await queryRunner.commitTransaction();
      return await this.findOne(id);
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  async markAllAsRead(
    params: MarkAllAsReadParams,
  ): Promise<{ affected: number }> {
    const { createdById, updatedById } = params;

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const updateResult = await queryRunner.manager.update(
        Notification,
        { createdById, isRead: false },
        {
          isRead: true,
          readAt: new Date(),
          updatedById,
        },
      );

      await queryRunner.commitTransaction();
      return { affected: updateResult.affected || 0 };
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  async getUserNotifications(
    createdById: number,
    params: FindNotificationsParams,
  ): Promise<NotificationPaginationResult> {
    const { page = 1, limit = 10, type, isRead } = params;
    const skip = (page - 1) * limit;

    const queryBuilder = this.notificationRepository
      .createQueryBuilder('notification')
      .leftJoinAndSelect('notification.createdBy', 'createdBy')
      .leftJoinAndSelect('notification.updatedBy', 'updatedBy')
      .where('notification.createdById = :createdById', { createdById });

    if (type) {
      queryBuilder.andWhere('notification.type = :type', { type });
    }

    if (isRead !== undefined) {
      queryBuilder.andWhere('notification.isRead = :isRead', { isRead });
    }

    const [data, total] = await queryBuilder
      .skip(skip)
      .take(limit)
      .orderBy('notification.createdAt', 'DESC')
      .getManyAndCount();

    return {
      data,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async getUnreadCount(createdById: number): Promise<number> {
    return await this.notificationRepository.count({
      where: {
        createdById,
        isRead: false,
      },
    });
  }
}
