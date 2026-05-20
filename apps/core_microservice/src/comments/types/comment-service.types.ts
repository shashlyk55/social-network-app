import { Comment } from 'src/entities/comment.entity';

export type CreateCommentParams = {
  content: string;
  postId: number;
  parentCommentId?: number;
};

export type UpdateCommentParams = {
  content?: string;
  updatedById?: number;
};

export type FindCommentsParams = {
  page?: number;
  limit?: number;
  postId?: number;
  parentCommentId?: number | null;
  order?: 'ASC' | 'DESC';
};

export type CommentPaginationResult = {
  data: Comment[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
};
