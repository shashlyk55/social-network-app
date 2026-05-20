import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { NotificationsConsumerService } from './notifications.service';
import { ProcessNotificationParams } from './types/params.types';

@Controller()
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
}
