import { Module } from '@nestjs/common';
import { NotificationsConsumerService as NotificationsConsumerService } from './notifications.service';
import { NotificationsController as NotificationsConsumerController } from './notifications.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Notification } from '../entities/notification.entity';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { UserNotification } from '../entities/user-notifications.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Notification, UserNotification]),
    ClientsModule.register([
      {
        name: 'REDIS_SERVICE',
        transport: Transport.REDIS,
        options: {
          host: 'localhost',
          port: 6379,
        },
      },
    ]),
  ],
  controllers: [NotificationsConsumerController],
  providers: [NotificationsConsumerService],
})
export class NotificationsConsumerModule {}
