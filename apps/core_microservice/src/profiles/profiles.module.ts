import { Module } from '@nestjs/common';
import { ProfilesService } from './profiles.service';
import { ProfilesController } from './profiles.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Profile } from 'src/entities/profile.entity';
import { ProfileFollow } from 'src/entities/many-to-many/profile-follow.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Profile, ProfileFollow])],
  controllers: [ProfilesController],
  providers: [ProfilesService],
  exports: [ProfilesService],
})
export class ProfilesModule {}
