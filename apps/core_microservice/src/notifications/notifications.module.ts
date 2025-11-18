import { Module } from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { NotificationsController } from './notifications.controller';
import { NotificationMappers } from './utils/params-mapper.util';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Notification } from 'src/entities/notification.entity';

@Module({
  controllers: [NotificationsController],
  providers: [NotificationsService, NotificationMappers],
  exports: [NotificationsService],
  imports: [TypeOrmModule.forFeature([Notification])],
})
export class NotificationsModule {}
