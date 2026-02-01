import { Module } from '@nestjs/common';
import { PostsService } from './posts.service';
import { PostsController } from './posts.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Post } from 'src/entities/post.entity';
import { PostAsset } from 'src/entities/many-to-many/post-asset.entity';
import { PostLike } from 'src/entities/many-to-many/post-like.entity';
import { ProfilesModule } from 'src/profiles/profiles.module';
import { AssetsModule } from 'src/assets/assets.module';
import { FollowModule } from 'src/follow/follow.module';

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
