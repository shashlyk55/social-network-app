import { Comment } from 'src/entities/comment.entity';
import {
  CreateCommentParams,
  UpdateCommentParams,
  FindCommentsParams,
  CreateCommentLikeParams,
  CommentPaginationResult,
} from '../types/comment-service.types';
import { CommentLike } from 'src/entities/many-to-many/comment-like.entity';

export type ICommentsService = {
  create(params: CreateCommentParams): Promise<Comment>;
  findAll(params: FindCommentsParams): Promise<CommentPaginationResult>;
  findOne(id: number): Promise<Comment>;
  update(params: UpdateCommentParams): Promise<Comment>;
  remove(id: number): Promise<void>;
  likeComment(params: CreateCommentLikeParams): Promise<CommentLike>;
  findPostComments(
    postId: number,
    params: FindCommentsParams,
  ): Promise<CommentPaginationResult>;
  findCommentReplies(
    commentId: number,
    params: FindCommentsParams,
  ): Promise<CommentPaginationResult>;
};
