import { Module } from '@nestjs/common';
import { NotificationsController } from './notifications.controller';
import { NotificationsProducerService } from './producer/notifications-producer.service';
import { NotificationsService } from './notifications.service';
import { ConfigModule } from '@nestjs/config';
import { InternalHttpModule } from 'src/internal-http/internal-http.module';

@Module({
  controllers: [NotificationsController],
  providers: [NotificationsProducerService, NotificationsService],
  exports: [NotificationsProducerService],
  imports: [
    ConfigModule.forRoot({ isGlobal: true, envFilePath: ['core.env'] }),
    InternalHttpModule,
  ],
})
export class NotificationsModule {}
