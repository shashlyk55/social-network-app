import { Module } from '@nestjs/common';
import { NotificationsController } from './notifications.controller';
import { NotificationsProducerService } from './producer/notifications-producer.service';
import { NotificationsService } from './notifications.service';

@Module({
  controllers: [NotificationsController],
  providers: [NotificationsProducerService, NotificationsService],
  exports: [NotificationsProducerService],
  imports: [],
})
export class NotificationsModule {}
