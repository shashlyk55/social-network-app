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
  page?: number;
  limit?: number;
  isArchived?: boolean;
  search?: string;
};

export type GetFeedParams = {
  userId: number;
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
