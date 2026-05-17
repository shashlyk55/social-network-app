import { Controller, Get, Query } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { NotificationsConsumerService } from './notifications.service';
import { ProcessNotificationParams } from './types/params.types';
import { plainToInstance } from 'class-transformer';
import { UserNotificationResponseDto } from './dto/user-notification.dto';

@Controller('internal/notifications')
export class NotificationsController {
  constructor(
    private readonly notificationsService: NotificationsConsumerService,
  ) {}

  @MessagePattern('notification_created')
  async handleNotificationCreated(@Payload() data: ProcessNotificationParams) {
    const notification =
      await this.notificationsService.processNotification(data);
    return notification;
  }

  @Get()
  async findAll(
    @Query('recipientId') recipientId: number,
    @Query('page') page?: number,
    @Query('limit') limit?: number,
    @Query('isRead') isRead?: boolean,
  ) {
    const params = { page, limit, isRead, recipientId };
    const result = await this.notificationsService.findAll(params);

    const transformedData = plainToInstance(
      UserNotificationResponseDto,
      result.data,
      {
        excludeExtraneousValues: true,
      },
    );

    return {
      data: transformedData,
      meta: result.meta,
    };
  }
}
