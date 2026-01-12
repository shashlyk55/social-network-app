import { Module } from '@nestjs/common';
import { FollowService } from './follow.service';
import { FollowController } from './follow.controller';
import { ProfilesModule } from 'src/profiles/profiles.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProfileFollow } from 'src/entities/many-to-many/profile-follow.entity';

@Module({
  controllers: [FollowController],
  providers: [FollowService],
  imports: [TypeOrmModule.forFeature([ProfileFollow]), ProfilesModule],
  exports: [FollowService],
})
export class FollowModule {}
