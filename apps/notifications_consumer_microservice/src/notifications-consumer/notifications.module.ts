import { Module } from '@nestjs/common';
import { NotificationsConsumerService as NotificationsConsumerService } from './notifications.service';
import { NotificationsController as NotificationsConsumerController } from './notifications.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Notification } from '../entities/notification.entity';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { UserNotification } from '../entities/user-notifications.entity';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    TypeOrmModule.forFeature([Notification, UserNotification]),
    ClientsModule.registerAsync([
      {
        name: 'REDIS_SERVICE',
        imports: [ConfigModule],
        inject: [ConfigService],
        useFactory: (configService: ConfigService) => ({
          transport: Transport.REDIS,
          options: {
            host: configService.get<string>('REDIS_HOST', 'localhost'),
            port: configService.get<number>('REDIS_PORT', 6379),
            password: configService.get<string>('REDIS_PASSWORD', 'password'),
          },
        }),
      },
    ]),
  ],
  controllers: [NotificationsConsumerController],
  providers: [NotificationsConsumerService],
})
export class NotificationsConsumerModule {}
