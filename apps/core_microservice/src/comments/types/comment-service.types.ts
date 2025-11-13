import { Comment } from 'src/entities/comment.entity';

export type CreateCommentParams = {
  content: string;
  postId: number;
  profileId: number;
  parentCommentId?: number;
  createdById: number;
};

export type UpdateCommentParams = {
  id: number;
  content?: string;
  updatedById?: number;
};

export type FindCommentsParams = {
  page?: number;
  limit?: number;
  postId?: number;
  profileId?: number;
  parentCommentId?: number | null;
};

export type CreateCommentLikeParams = {
  commentId: number;
  profileId: number;
  createdById: number;
};

export type CommentPaginationResult = {
  data: Comment[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
};
