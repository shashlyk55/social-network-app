import { Post } from 'src/entities/post.entity';

export type CreatePostParams = {
  content: string;
  profileId: number;
  isArchived?: boolean;
  createdById: number;
  assetIds?: number[];
};

export type UpdatePostParams = {
  id: number;
  content?: string;
  isArchived?: boolean;
  updatedById?: number;
  assetIds?: number[];
};

export type FindPostsParams = {
  page?: number;
  limit?: number;
  isArchived?: boolean;
};

export type FindProfilePostsParams = {
  page?: number;
  limit?: number;
  profileId?: number;
};

export type CreatePostLikeParams = {
  postId: number;
  profileId: number;
  createdById: number;
};

export type PostPaginationResult = {
  data: Post[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
};
