import { Comment } from 'src/entities/comment.entity';
import {
  CreateCommentParams,
  UpdateCommentParams,
  FindCommentsParams,
  CommentPaginationResult,
} from '../types/comment-service.types';
import { CommentLike } from 'src/entities/many-to-many/comment-like.entity';

export type ICommentsService = {
  create(userId: number, params: CreateCommentParams): Promise<Comment>;
  findAll(params: FindCommentsParams): Promise<CommentPaginationResult>;
  findOne(id: number): Promise<Comment>;
  update(
    userId: number,
    commentId: number,
    params: UpdateCommentParams,
  ): Promise<Comment>;
  remove(userId: number, commentId: number): Promise<void>;
  likeComment(userId: number, commentId: number): Promise<CommentLike>;
};
