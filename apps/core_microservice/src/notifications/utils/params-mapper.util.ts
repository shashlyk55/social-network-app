import { CreateNotificationDto } from '../dto/create-notification.dto';
import { UpdateNotificationDto } from '../dto/update-notification.dto';
import { NotificationResponseDto } from '../dto/notification-response.dto';
import {
  PaginationResponseDto,
  PaginationMetaDto,
} from '../../common/dto/pagination-response.dto';
import {
  CreateNotificationParams,
  UpdateNotificationParams,
  MarkAsReadParams,
  NotificationPaginationResult,
} from '../types/notification-service.types';
import { Notification } from 'src/entities/notification.entity';
import { MarkAsReadDto } from '../dto/mark-as-read.dto';

export class NotificationMappers {
  static toCreateParams(dto: CreateNotificationDto): CreateNotificationParams {
    return {
      type: dto.type,
      title: dto.title,
      message: dto.message,
      data: dto.data,
      createdById: dto.createdById,
    };
  }

  static toUpdateParams(
    id: number,
    dto: UpdateNotificationDto,
  ): UpdateNotificationParams {
    return {
      id,
      isRead: dto.isRead,
      updatedById: dto.updatedById,
    };
  }

  static toNotificationResponse(
    notification: Notification,
  ): NotificationResponseDto {
    const response: NotificationResponseDto = {
      id: notification.id,
      type: notification.type,
      title: notification.title,
      message: notification.message,
      data: notification.data,
      isRead: notification.isRead,
      readAt: notification.readAt,
      createdAt: notification.createdAt,
      updatedAt: notification.updatedAt,
      createdById: notification.createdById,
      updatedById: notification.updatedById,
      createdBy: {
        id: notification.createdBy.id,
        role: notification.createdBy.role,
      },
    };

    if (notification.updatedBy) {
      response.updatedBy = {
        id: notification.updatedBy.id,
        role: notification.updatedBy.role,
      };
    }

    return response;
  }

  static toMarkAsReadParams(id: number, dto: MarkAsReadDto): MarkAsReadParams {
    return {
      id,
      isRead: dto.isRead !== undefined ? dto.isRead : true,
      updatedById: dto.updatedById,
    };
  }

  static toPaginationResponse(
    result: NotificationPaginationResult,
  ): PaginationResponseDto<NotificationResponseDto> {
    return {
      data: result.data.map((notification) =>
        this.toNotificationResponse(notification),
      ),
      meta: {
        page: result.page,
        limit: result.limit,
        total: result.total,
        totalPages: result.totalPages,
      },
    };
  }
}
