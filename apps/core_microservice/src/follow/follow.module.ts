import { Module } from '@nestjs/common';
import { FollowService } from './follow.service';
import { FollowController } from './follow.controller';
import { ProfilesModule } from 'src/profiles/profiles.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProfileFollow } from 'src/entities/many-to-many/profile-follow.entity';
import { NotificationsModule } from 'src/notifications/notifications.module';

@Module({
  controllers: [FollowController],
  providers: [FollowService],
  imports: [
    TypeOrmModule.forFeature([ProfileFollow]),
    ProfilesModule,
    NotificationsModule,
  ],
  exports: [FollowService],
})
export class FollowModule {}
