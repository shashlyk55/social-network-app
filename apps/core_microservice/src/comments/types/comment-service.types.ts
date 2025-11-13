export type CreateCommentParams = {
  authorId: number;
  postId: number;
  content: string;
};

export type FindAllCommentsParams = {
  page?: number;
  limit?: number;
  postId?: number;
  authorId?: number;
  sortBy?: string;
  sortOrder?: 'ASC' | 'DESC';
};

export type FindAllCommentsResult = {
  comments: any[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
};

export type UpdateCommentParams = {
  content?: string;
};

// Basic types
export type UserCommentParams = {
  userId: number;
  commentId: number;
};

export type CommentIdParams = {
  commentId: number;
};

export type PostIdParams = {
  postId: number;
};

export type LikeCommentParams = {
  commentId: number;
  userId: number;
};

export type LikeCommentResult = {
  liked: boolean;
  likesCount: number;
};
