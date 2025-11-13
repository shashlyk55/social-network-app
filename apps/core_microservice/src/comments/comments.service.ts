import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  InternalServerErrorException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource, FindOptionsWhere, ILike } from 'typeorm';
import {
  CreateCommentParams,
  FindAllCommentsParams,
  UpdateCommentParams,
  UserCommentParams,
  CommentIdParams,
  PostIdParams,
  FindAllCommentsResult,
  LikeCommentParams,
  LikeCommentResult,
} from './types/comment-service.types';

import { PostsService } from '../posts/posts.service';
import { CommentLike } from 'src/entities/many-to-many/comment-like.entity';
import { Post } from 'src/entities/post.entity';
import { User } from 'src/entities/user.entity';
import { ICommentsService } from './interfaces/ICommentsService';
import { Comment as CommentEntity } from 'src/entities/comment.entity';

@Injectable()
export class CommentsService implements ICommentsService {
  constructor(
    @InjectRepository(CommentEntity)
    private readonly commentRepository: Repository<CommentEntity>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Post)
    private readonly postRepository: Repository<Post>,
    @InjectRepository(CommentLike)
    private readonly commentLikeRepository: Repository<CommentLike>,

    private readonly postsService: PostsService,
    private readonly dataSource: DataSource,
  ) {}

  async create(params: CreateCommentParams): Promise<CommentEntity> {
    const { authorId, postId, content } = params;

    const user = await this.userRepository.findOne({ where: { id: authorId } });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const post = await this.postRepository.findOne({ where: { id: postId } });
    if (!post) {
      throw new NotFoundException('Post not found');
    }

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const comment = this.commentRepository.create({
        content,
        authorId,
        postId,
      });

      const savedComment = await queryRunner.manager.save(comment);

      // Увеличиваем счетчик комментариев в посте
      await this.postsService.incrementCommentsCount({ postId });

      await queryRunner.commitTransaction();

      // Возвращаем комментарий с отношениями
      return await this.findOne({ commentId: savedComment.id });
    } catch (error) {
      await queryRunner.rollbackTransaction();

      if (error instanceof NotFoundException) {
        throw error;
      }

      throw new InternalServerErrorException(
        'Failed to create comment: ' + error.message,
      );
    } finally {
      await queryRunner.release();
    }
  }

  async findAll(params: FindAllCommentsParams): Promise<FindAllCommentsResult> {
    const {
      page = 1,
      limit = 10,
      postId,
      authorId,
      sortBy = 'createdAt',
      sortOrder = 'DESC',
    } = params;

    const where: FindOptionsWhere<CommentEntity> = {};

    if (postId) {
      where.postId = postId;
    }

    if (authorId) {
      where.authorId = authorId;
    }

    const [comments, total] = await this.commentRepository.findAndCount({
      where,
      relations: ['author', 'author.profile', 'commentLikes'],
      order: { [sortBy]: sortOrder },
      skip: (page - 1) * limit,
      take: limit,
    });

    const totalPages: number = Math.ceil(total / limit);

    console.log(comments);

    return { comments, total, page, limit, totalPages };
  }

  async findOne(params: CommentIdParams): Promise<CommentEntity> {
    const { commentId } = params;

    const comment = await this.commentRepository.findOne({
      where: { id: commentId },
      relations: [
        'author',
        'author.profile',
        'commentLikes',
        'post',
        'post.author',
      ],
    });

    if (!comment) {
      throw new NotFoundException(`Comment with ID ${commentId} not found`);
    }

    return comment;
  }

  async update(
    params: UserCommentParams & UpdateCommentParams,
  ): Promise<CommentEntity> {
    const { userId, commentId, content } = params;

    const comment = await this.findOne({ commentId });

    // Проверяем права на редактирование
    if (comment.authorId !== userId) {
      throw new ForbiddenException('You can only update your own comments');
    }

    try {
      // Обновляем комментарий
      await this.commentRepository.update(commentId, {
        content,
        updatedAt: new Date(),
      });

      // Возвращаем обновленный комментарий
      return await this.findOne({ commentId });
    } catch (error) {
      throw new InternalServerErrorException(
        'Failed to update comment: ' + error.message,
      );
    }
  }

  async remove(params: UserCommentParams): Promise<void> {
    const { userId, commentId } = params;

    const comment = await this.findOne({ commentId });

    // Проверяем права на удаление
    if (comment.authorId !== userId) {
      throw new ForbiddenException('You can only delete your own comments');
    }

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // Удаляем лайки комментария
      await queryRunner.manager.delete(CommentLike, { commentId });

      // Удаляем сам комментарий
      await queryRunner.manager.delete(CommentEntity, { id: commentId });

      // Уменьшаем счетчик комментариев в посте
      await this.postsService.decrementCommentsCount({
        postId: comment.postId,
      });

      await queryRunner.commitTransaction();
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw new InternalServerErrorException(
        'Failed to delete comment: ' + error.message,
      );
    } finally {
      await queryRunner.release();
    }
  }

  async findByPost(
    params: PostIdParams & FindAllCommentsParams,
  ): Promise<FindAllCommentsResult> {
    const { postId, ...findParams } = params;

    const post = await this.postRepository.findOne({ where: { id: postId } });
    if (!post) {
      throw new NotFoundException('Post not found');
    }

    const postCommentsParams: FindAllCommentsParams = {
      ...findParams,
      postId,
    };

    return this.findAll(postCommentsParams);
  }

  async likeComment(params: LikeCommentParams): Promise<LikeCommentResult> {
    const { commentId, userId } = params;

    const comment = await this.findOne({ commentId });

    if (!comment) {
      throw new NotFoundException('Comment not found');
    }

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const existingLike = await queryRunner.manager.findOne(CommentLike, {
        where: { commentId, userId },
      });

      if (existingLike) {
        await queryRunner.manager.delete(CommentLike, { commentId, userId });
        await this.decrementLikesCount({ commentId });
      } else {
        const commentLike = this.commentLikeRepository.create({
          commentId,
          userId,
        });
        await queryRunner.manager.save(commentLike);
        await this.incrementLikesCount({ commentId });
      }

      await queryRunner.commitTransaction();

      const updatedComment = await this.commentRepository.findOne({
        where: { id: commentId },
        select: ['id', 'likesCount'],
      });

      if (!updatedComment) {
        throw new NotFoundException('Liked Comment not found');
      }

      return {
        liked: !existingLike,
        likesCount: updatedComment.likesCount || 0,
      };
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw new InternalServerErrorException(
        'Failed to like comment: ' + error.message,
      );
    } finally {
      await queryRunner.release();
    }
  }

  async incrementLikesCount(params: CommentIdParams): Promise<void> {
    const { commentId } = params;
    await this.commentRepository.increment({ id: commentId }, 'likesCount', 1);
  }

  async decrementLikesCount(params: CommentIdParams): Promise<void> {
    const { commentId } = params;
    await this.commentRepository.decrement({ id: commentId }, 'likesCount', 1);
  }
}
