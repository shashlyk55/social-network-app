import { Module } from '@nestjs/common';
import { PostsService } from './posts.service';
import { PostsController } from './posts.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Post } from 'src/entities/post.entity';
import { User } from 'src/entities/user.entity';
import { Asset } from 'src/entities/asset.entity';
import { PostAsset } from 'src/entities/many-to-many/post-asset.entity';
import { PostLike } from 'src/entities/many-to-many/post-like.entity';
import { UsersModule } from 'src/users/users.module';
import { Profile } from 'src/entities/profile.entity';

@Module({
  controllers: [PostsController],
  providers: [PostsService],
  imports: [
    TypeOrmModule.forFeature([Post, Asset, PostAsset, PostLike, Profile]),
    UsersModule,
  ],
  exports: [PostsService],
})
export class PostsModule {}
