import { Module } from '@nestjs/common';
import { PostsService } from './posts.service';
import { PostsController } from './posts.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Post } from 'src/entities/post.entity';
import { Asset } from 'src/entities/asset.entity';
import { PostAsset } from 'src/entities/many-to-many/post-asset.entity';
import { PostLike } from 'src/entities/many-to-many/post-like.entity';
import { Profile } from 'src/entities/profile.entity';
import { ProfilesModule } from 'src/profiles/profiles.module';
import { AssetsModule } from 'src/assets/assets.module';
import { FollowService } from 'src/follow/follow.service';
import { FollowModule } from 'src/follow/follow.module';
import { ProfileFollow } from 'src/entities/many-to-many/profile-follow.entity';

@Module({
  controllers: [PostsController],
  providers: [PostsService],
  imports: [
    TypeOrmModule.forFeature([Post, PostAsset, PostLike]),
    ProfilesModule,
    AssetsModule,
    FollowModule,
  ],
  exports: [PostsService],
})
export class PostsModule {}
