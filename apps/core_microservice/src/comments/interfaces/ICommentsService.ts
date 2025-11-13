import { Comment as CommentEntity } from 'src/entities/comment.entity';
import {
  CommentIdParams,
  CreateCommentParams,
  FindAllCommentsParams,
  FindAllCommentsResult,
  LikeCommentParams,
  LikeCommentResult,
  PostIdParams,
  UpdateCommentParams,
  UserCommentParams,
} from '../types/comment-service.types';

export interface ICommentsService {
  create(params: CreateCommentParams): Promise<CommentEntity>;
  findAll(params: FindAllCommentsParams): Promise<FindAllCommentsResult>;
  findOne(params: CommentIdParams): Promise<CommentEntity>;
  update(
    params: UserCommentParams & UpdateCommentParams,
  ): Promise<CommentEntity>;
  remove(params: UserCommentParams): Promise<void>;

  findByPost(
    params: PostIdParams & FindAllCommentsParams,
  ): Promise<FindAllCommentsResult>;

  likeComment(params: LikeCommentParams): Promise<LikeCommentResult>;
  incrementLikesCount(params: CommentIdParams): Promise<void>;
  decrementLikesCount(params: CommentIdParams): Promise<void>;
}
