import { Post } from 'src/entities/post.entity';

export type CreatePostParams = {
  content: string;
  isArchived?: boolean;
  assetIds?: number[];
};

export type UpdatePostParams = {
  id: number;
  content?: string;
  assetIds?: number[];
};

export type FindPostsParams = {
  userId?: number;
  page?: number;
  limit?: number;
  isArchived?: boolean;
  search?: string;
  authorProfileId?: number;
};

export type GetFeedParams = {
  page?: number;
  limit?: number;
};

export type PostPaginationResult = {
  data: Post[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
};

export type PostLikeResult = {
  postId: number;
  isLiked: boolean;
  likesCount: number;
};
