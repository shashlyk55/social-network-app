import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { Comment } from '../entities/comment.entity';
import { CommentLike } from 'src/entities/many-to-many/comment-like.entity';
import { ICommentsService } from './interfaces/ICommentsService';
import {
  CreateCommentParams,
  FindCommentsParams,
  CommentPaginationResult,
  UpdateCommentParams,
  CreateCommentLikeParams,
} from './types/comment-service.types';
import {
  CommentNotFoundException,
  CommentOperationException,
  CommentWithRepliesException,
  ParentCommentNotFoundException,
} from './exceptions/comment-domain.exceptions';
import { DomainException } from 'src/app/exceptions/domain.exception';

@Injectable()
export class CommentsService implements ICommentsService {
  constructor(
    @InjectRepository(Comment)
    private readonly commentRepository: Repository<Comment>,
    @InjectRepository(CommentLike)
    private readonly commentLikeRepository: Repository<CommentLike>,
    private readonly dataSource: DataSource,
  ) {}

  async create(params: CreateCommentParams): Promise<Comment> {
    if (params.parentCommentId) {
      const parentComment = await this.commentRepository.findOne({
        where: { id: params.parentCommentId },
      });
      if (!parentComment) {
        throw new ParentCommentNotFoundException(params.parentCommentId);
      }
    }

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const comment = this.commentRepository.create({
        content: params.content,
        postId: params.postId,
        profileId: params.profileId,
        parentCommentId: params.parentCommentId,
        createdById: params.createdById,
      });

      const savedComment = await queryRunner.manager.save(Comment, comment);
      await queryRunner.commitTransaction();
      return await this.findOne(savedComment.id);
    } catch (error) {
      queryRunner.rollbackTransaction();
      if (error instanceof DomainException) {
        throw error;
      }

      throw new CommentOperationException('create comment', error.message);
    } finally {
      queryRunner.release();
    }
  }

  async findAll(params: FindCommentsParams): Promise<CommentPaginationResult> {
    try {
      const {
        page = 1,
        limit = 10,
        postId,
        profileId,
        parentCommentId,
      } = params;
      const skip = (page - 1) * limit;

      const queryBuilder = this.commentRepository
        .createQueryBuilder('comment')
        .leftJoinAndSelect('comment.profile', 'profile')
        .leftJoinAndSelect('comment.createdBy', 'createdBy')
        .leftJoinAndSelect('comment.updatedBy', 'updatedBy')
        .leftJoinAndSelect('comment.commentLikes', 'commentLikes')
        .leftJoinAndSelect('commentLikes.profile', 'likeProfile')
        .leftJoinAndSelect('comment.replies', 'replies')
        .where('comment.parentCommentId IS NULL');

      if (postId) {
        queryBuilder.andWhere('comment.postId = :postId', { postId });
      }

      if (profileId) {
        queryBuilder.andWhere('comment.profileId = :profileId', { profileId });
      }

      if (parentCommentId !== undefined) {
        if (parentCommentId === null) {
          queryBuilder.andWhere('comment.parentCommentId IS NULL');
        } else {
          queryBuilder.andWhere('comment.parentCommentId = :parentCommentId', {
            parentCommentId,
          });
        }
      }

      const [data, total] = await queryBuilder
        .skip(skip)
        .take(limit)
        .orderBy('comment.createdAt', 'DESC')
        .getManyAndCount();

      return {
        data,
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      };
    } catch (error) {
      throw new CommentOperationException('find comments', error.message);
    }
  }

  async findOne(id: number): Promise<Comment> {
    try {
      const comment = await this.commentRepository.findOne({
        where: { id },
        relations: [
          'profile',
          'createdBy',
          'updatedBy',
          'commentLikes',
          'commentLikes.profile',
          'replies',
          'replies.profile',
          'replies.commentLikes',
          'parentComment',
        ],
      });

      if (!comment) {
        throw new CommentNotFoundException(id);
      }

      return comment;
    } catch (error) {
      if (error instanceof CommentNotFoundException) {
        throw error;
      }
      throw new CommentOperationException('find comment', error.message);
    }
  }

  async update(params: UpdateCommentParams): Promise<Comment> {
    const { id, ...updateData } = params;

    const comment = await this.findOne(id);

    if (!comment) {
      throw new CommentNotFoundException(id);
    }

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const updatePayload: Partial<Comment> = {};
      if (updateData.content !== undefined)
        updatePayload.content = updateData.content;
      if (updateData.updatedById !== undefined)
        updatePayload.updatedById = updateData.updatedById;

      await queryRunner.manager.update(Comment, id, updatePayload);

      await queryRunner.commitTransaction();

      return await this.findOne(id);
    } catch (error) {
      await queryRunner.rollbackTransaction();
      if (error instanceof DomainException) {
        throw error;
      }

      throw new CommentOperationException('update comment', error.message);
    } finally {
      queryRunner.release();
    }
  }

  async remove(id: number): Promise<void> {
    const comment = await this.findOne(id);

    if (!comment) {
      throw new CommentNotFoundException(id);
    }

    if (comment.replies && comment.replies.length > 0) {
      throw new CommentWithRepliesException(id);
    }
    // TODO: maybe every comment can be deleted

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      await queryRunner.manager.remove(Comment, comment);

      await queryRunner.commitTransaction();
    } catch (error) {
      await queryRunner.rollbackTransaction();
      if (error instanceof DomainException) {
        throw error;
      }

      throw new CommentOperationException('delete comment', error.message);
    } finally {
      await queryRunner.release();
    }
  }

  async likeComment(params: CreateCommentLikeParams): Promise<CommentLike> {
    const { commentId, profileId, createdById } = params;

    const comment = await this.findOne(commentId);

    if (!comment) {
      throw new CommentNotFoundException(commentId);
    }

    const existingLike = await this.commentLikeRepository.findOne({
      where: { commentId, profileId },
    });

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      if (existingLike) {
        return await queryRunner.manager.remove(CommentLike, existingLike);
      }

      const like = this.commentLikeRepository.create({
        commentId,
        profileId,
        createdById,
      });

      const savedLike = await queryRunner.manager.save(CommentLike, like);
      await queryRunner.commitTransaction();

      return savedLike;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      if (error instanceof DomainException) {
        throw error;
      }

      throw new CommentOperationException('like comment', error.message);
    } finally {
      await queryRunner.release();
    }
  }

  async findPostComments(
    postId: number,
    params: FindCommentsParams,
  ): Promise<CommentPaginationResult> {
    try {
      const { page = 1, limit = 10 } = params;
      const skip = (page - 1) * limit;

      const queryBuilder = this.commentRepository
        .createQueryBuilder('comment')
        .leftJoinAndSelect('comment.profile', 'profile')
        .leftJoinAndSelect('comment.createdBy', 'createdBy')
        .leftJoinAndSelect('comment.updatedBy', 'updatedBy')
        .leftJoinAndSelect('comment.commentLikes', 'commentLikes')
        .leftJoinAndSelect('commentLikes.profile', 'likeProfile')
        .leftJoinAndSelect('comment.replies', 'replies')
        .where('comment.postId = :postId', { postId })
        .andWhere('comment.parentCommentId IS NULL');

      const [data, total] = await queryBuilder
        .skip(skip)
        .take(limit)
        .orderBy('comment.createdAt', 'DESC')
        .getManyAndCount();

      return {
        data,
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      };
    } catch (error) {
      throw new CommentOperationException('find post comments', error.message);
    }
  }

  async findCommentReplies(
    commentId: number,
    params: FindCommentsParams,
  ): Promise<CommentPaginationResult> {
    try {
      const { page = 1, limit = 10 } = params;
      const skip = (page - 1) * limit;

      const comment = await this.findOne(commentId);

      if (!comment) {
        throw new CommentNotFoundException(commentId);
      }

      const queryBuilder = this.commentRepository
        .createQueryBuilder('comment')
        .leftJoinAndSelect('comment.profile', 'profile')
        .leftJoinAndSelect('comment.createdBy', 'createdBy')
        .leftJoinAndSelect('comment.updatedBy', 'updatedBy')
        .leftJoinAndSelect('comment.commentLikes', 'commentLikes')
        .leftJoinAndSelect('commentLikes.profile', 'likeProfile')
        .where('comment.parentCommentId = :commentId', { commentId });

      const [data, total] = await queryBuilder
        .skip(skip)
        .take(limit)
        .orderBy('comment.createdAt', 'ASC')
        .getManyAndCount();

      return {
        data,
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      };
    } catch (error) {
      throw new CommentOperationException(
        'find comment replies',
        error.message,
      );
    }
  }
}
