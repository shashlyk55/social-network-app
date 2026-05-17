import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InternalHttpService } from 'src/internal-http/internal-http.service';
import { FindNotificationsParams } from './types/notification-service.types';
import { PaginatedData } from 'src/common/types/paginated-data';
import { UserNotificationResponseDto } from './dto/user-notification.dto';

@Injectable()
export class NotificationsService {
  constructor(
    private readonly internalHttpService: InternalHttpService,
    private readonly configService: ConfigService,
  ) {}

  async findAll(
    params: FindNotificationsParams,
  ): Promise<PaginatedData<UserNotificationResponseDto>> {
    const notificationsServiceUrl = this.configService.get<string>(
      'NOTIFICATIONS_MICROSERVICE_URL',
      'http://localhost:3003/internal',
    );

    const result = await this.internalHttpService.get<
      PaginatedData<UserNotificationResponseDto>
    >(`${notificationsServiceUrl}/notifications`, {
      params: {
        recipientId: params.recipientId,
        page: params.page,
        limit: params.limit,
        isRead: params.isRead,
      },
    });

    return result;
  }
}
