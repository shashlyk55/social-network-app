import { Module } from '@nestjs/common';
import { CommentsService } from './comments.service';
import { CommentsController } from './comments.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/entities/user.entity';
import { Comment } from 'src/entities/comment.entity';
import { Post } from 'src/entities/post.entity';
import { CommentLike } from 'src/entities/many-to-many/comment-like.entity';
import { PostsModule } from 'src/posts/posts.module';
import { Profile } from 'src/entities/profile.entity';

@Module({
  controllers: [CommentsController],
  providers: [CommentsService],
  exports: [CommentsService],
  imports: [
    TypeOrmModule.forFeature([Comment, Post, CommentLike, Profile]),
    PostsModule,
  ],
})
export class CommentsModule {}
