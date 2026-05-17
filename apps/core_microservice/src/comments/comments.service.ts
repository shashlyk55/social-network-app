import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Comment } from '../entities/comment.entity';
import { CommentLike } from 'src/entities/many-to-many/comment-like.entity';
import {
  CreateCommentParams,
  FindCommentsParams,
  UpdateCommentParams,
} from './types/comment-service.types';
import {
  CommentAccessDenied,
  CommentNestingLevelException,
  CommentNotFoundException,
  CommentOperationException,
  ParentCommentNotFoundException,
} from './exceptions/comment-domain.exceptions';
import { DomainException } from 'src/app/exceptions/domain.exception';
import { PostsService } from 'src/posts/posts.service';
import { ProfilesService } from 'src/profiles/profiles.service';
import { NotificationsProducerService } from 'src/notifications/producer/notifications-producer.service';
import { PaginatedData } from 'src/common/types/paginated-data';

@Injectable()
export class CommentsService {
  constructor(
    @InjectRepository(Comment)
    private readonly commentRepository: Repository<Comment>,
    @InjectRepository(CommentLike)
    private readonly commentLikeRepository: Repository<CommentLike>,
    private readonly postService: PostsService,
    private readonly profilesService: ProfilesService,
    private readonly notificationsProducer: NotificationsProducerService,
  ) {}

  async create(userId: number, params: CreateCommentParams): Promise<Comment> {
    const post = await this.postService.findOne(params.postId);

    const profile = await this.profilesService.findByUserId(userId);

    const recipientIds = new Set<number>();
    if (post.createdById !== userId) {
      recipientIds.add(post.createdById);
    }

    if (params.parentCommentId) {
      const parentComment = await this.commentRepository.findOne({
        where: { id: params.parentCommentId },
        select: ['id', 'parentCommentId'],
      });
      if (!parentComment) {
        throw new ParentCommentNotFoundException(params.parentCommentId);
      }

      if (parentComment.parentCommentId !== null) {
        throw new CommentNestingLevelException();
      }

      if (parentComment.createdById !== userId) {
        recipientIds.add(parentComment.createdById);
      }
    }

    try {
      const comment = this.commentRepository.create({
        content: params.content,
        postId: params.postId,
        profileId: profile.id,
        parentCommentId: params.parentCommentId,
        createdById: userId,
      });

      const savedComment = await this.commentRepository.save(comment);

      if (params.parentCommentId) {
        await this.notificationsProducer.emitCommentReplyNotification({
          recipientIds: Array.from(recipientIds),
          senderId: userId,
          message: 'User replied to your comment',
          data: {
            postId: params.postId,
          },
        });
      } else {
        await this.notificationsProducer.emitNewCommentNotification({
          recipientIds: Array.from(recipientIds),
          senderId: userId,
          message: 'New comment',
          data: { postId: params.postId, commentText: params.content },
        });
      }

      return await this.findOne(savedComment.id);
    } catch (error: any) {
      if (error instanceof DomainException) {
        throw error;
      }

      throw new CommentOperationException('create comment', error.message);
    }
  }

  async findAll(
    params: FindCommentsParams,
    userId?: number,
  ): Promise<PaginatedData<Comment>> {
    const {
      page = 1,
      limit = 10,
      postId,
      parentCommentId,
      order = 'DESC',
    } = params;

    const skip = (page - 1) * limit;

    try {
      const queryBuilder = this.commentRepository
        .createQueryBuilder('comment')
        .leftJoinAndSelect('comment.profile', 'profile');

      if (userId !== undefined) {
        queryBuilder.addSelect((subQuery) => {
          return subQuery
            .select('COUNT(l.id) > 0', 'isLiked')
            .from('main.comments_likes', 'l')
            .where('l.comment_id = comment.id')
            .andWhere('l.created_by = :currentUserId', {
              currentUserId: userId,
            });
        }, 'comment_isLiked');
      }

      if (postId) {
        queryBuilder.andWhere('comment.postId = :postId', { postId });
      }

      if (parentCommentId === undefined) {
        queryBuilder.andWhere('comment.parentCommentId IS NULL');
      } else {
        queryBuilder.andWhere('comment.parentCommentId = :parentCommentId', {
          parentCommentId,
        });
      }

      const [data, total] = await queryBuilder
        .orderBy('comment.createdAt', order)
        .skip(skip)
        .take(limit)
        .getManyAndCount();

      return {
        data,
        meta: { total, page, limit, totalPages: Math.ceil(total / limit) },
      };
    } catch (error: any) {
      throw new CommentOperationException('find comments', error.message);
    }
  }

  async findOne(id: number): Promise<Comment> {
    try {
      const comment = await this.commentRepository
        .createQueryBuilder('comment')
        .leftJoinAndSelect('comment.profile', 'profile')
        .where('comment.id = :id', { id })
        .getOne();

      if (!comment) {
        throw new CommentNotFoundException(id);
      }

      return comment;
    } catch (error: any) {
      if (error instanceof CommentNotFoundException) {
        throw error;
      }
      throw new CommentOperationException('find comment', error.message);
    }
  }

  async update(
    userId: number,
    commentId: number,
    params: UpdateCommentParams,
  ): Promise<Comment> {
    const comment = await this.findOne(commentId);
    if (comment.createdById !== userId) {
      throw new CommentAccessDenied();
    }

    try {
      const updatePayload: Partial<Comment> = {};
      if (params.content !== undefined) updatePayload.content = params.content;
      updatePayload.updatedById = userId;
      updatePayload.updatedAt = new Date();
      await this.commentRepository.update(commentId, updatePayload);

      return await this.findOne(commentId);
    } catch (error: any) {
      throw new CommentOperationException('update comment', error.message);
    }
  }

  async remove(userId: number, commentId: number): Promise<void> {
    const comment = await this.findOne(commentId);
    if (comment.createdById !== userId) {
      throw new CommentAccessDenied();
    }
    try {
      await this.commentRepository.remove(comment);
    } catch (error: any) {
      throw new CommentOperationException('delete comment', error.message);
    }
  }

  async toggleLikeComment(
    userId: number,
    commentId: number,
  ): Promise<{ commentId: number; isLiked: boolean; likesCount: number }> {
    const profile = await this.profilesService.findByUserId(userId);

    await this.findOne(commentId);

    const existingLike = await this.commentLikeRepository.findOne({
      where: { commentId, profileId: profile.id },
    });

    try {
      if (existingLike) {
        await this.commentLikeRepository.remove(existingLike);
      } else {
        const like = this.commentLikeRepository.create({
          commentId,
          profileId: profile.id,
          createdById: userId,
        });

        await this.commentLikeRepository.save(like);

        const savedLike = await this.commentLikeRepository.findOne({
          where: { id: like.id },
          relations: ['comment'],
        });

        if (savedLike !== null && savedLike.comment.createdById !== userId) {
          await this.notificationsProducer.emitCommentLikeNotification({
            recipientIds: [savedLike.comment.createdById],
            senderId: userId,
            message: 'User liked your comment',
            data: {
              postId: savedLike.comment.postId,
              commentId: savedLike.comment.id,
              likerId: savedLike.createdById,
            },
          });
        }
      }

      const likesCount = await this.commentLikeRepository.count({
        where: { commentId },
      });

      return {
        commentId,
        isLiked: !existingLike,
        likesCount,
      };
    } catch (error: any) {
      // process Race Condition error in DB
      // If 2 requests coming in one time, just ignore this
      if (error.code === '23505') {
        const likesCount = await this.commentLikeRepository.count({
          where: { commentId },
        });
        return {
          commentId,
          isLiked: true,
          likesCount,
        };
      }

      throw new CommentOperationException('like comment', error.message);
    }
  }
}
