import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
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

@Injectable()
export class CommentsService implements ICommentsService {
  constructor(
    @InjectRepository(Comment)
    private readonly commentRepository: Repository<Comment>,
    @InjectRepository(CommentLike)
    private readonly commentLikeRepository: Repository<CommentLike>,
  ) {}

  async create(params: CreateCommentParams): Promise<Comment> {
    if (params.parentCommentId) {
      const parentComment = await this.commentRepository.findOne({
        where: { id: params.parentCommentId },
      });
      if (!parentComment) {
        throw new NotFoundException(
          `Parent comment with ID ${params.parentCommentId} not found`,
        );
      }
    }

    const comment = this.commentRepository.create({
      content: params.content,
      postId: params.postId,
      profileId: params.profileId,
      parentCommentId: params.parentCommentId,
      createdById: params.createdById,
    });

    const savedComment = await this.commentRepository.save(comment);
    return await this.findOne(savedComment.id);
  }

  async findAll(params: FindCommentsParams): Promise<CommentPaginationResult> {
    const { page = 1, limit = 10, postId, profileId, parentCommentId } = params;
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
  }

  async findOne(id: number): Promise<Comment> {
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
      throw new NotFoundException(`Comment with ID ${id} not found`);
    }

    return comment;
  }

  async update(params: UpdateCommentParams): Promise<Comment> {
    const { id, ...updateData } = params;

    const comment = await this.findOne(id);

    if (!comment) {
      throw new NotFoundException('Comment not found');
    }

    const updatePayload: Partial<Comment> = {};
    if (updateData.content !== undefined)
      updatePayload.content = updateData.content;
    if (updateData.updatedById !== undefined)
      updatePayload.updatedById = updateData.updatedById;

    await this.commentRepository.update(id, updatePayload);

    return await this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    const comment = await this.findOne(id);

    if (comment.replies && comment.replies.length > 0) {
      throw new ConflictException('Cannot delete comment with replies');
    }

    await this.commentRepository.remove(comment);
  }

  async likeComment(params: CreateCommentLikeParams): Promise<CommentLike> {
    const { commentId, profileId, createdById } = params;

    const comment = await this.findOne(commentId);

    if (!comment) {
      throw new NotFoundException('Comment not found');
    }

    const existingLike = await this.commentLikeRepository.findOne({
      where: { commentId, profileId },
    });

    if (existingLike) {
      return await this.commentLikeRepository.remove(existingLike);
    }

    const like = this.commentLikeRepository.create({
      commentId,
      profileId,
      createdById,
    });

    return await this.commentLikeRepository.save(like);
  }

  async findPostComments(
    postId: number,
    params: FindCommentsParams,
  ): Promise<CommentPaginationResult> {
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
  }

  async findCommentReplies(
    commentId: number,
    params: FindCommentsParams,
  ): Promise<CommentPaginationResult> {
    const { page = 1, limit = 10 } = params;
    const skip = (page - 1) * limit;

    const comment = await this.findOne(commentId);

    if (!comment) {
      throw new NotFoundException('Comment not found');
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
  }
}
