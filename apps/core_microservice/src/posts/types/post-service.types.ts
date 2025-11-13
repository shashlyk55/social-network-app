export type CreatePostParams = {
  authorId: number;
  content: string;
  location?: string;
  assetIds?: number[];
};

export type FindAllPostsParams = {
  page?: number;
  limit?: number;
  search?: string;
  authorId?: number;
  sortBy?: string;
  sortOrder?: 'ASC' | 'DESC';
};

export type FindAllPostsResult = {
  posts: any[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
};

export type UpdatePostParams = {
  content?: string;
  location?: string;
  deletedAt?: Date;
  assetIds?: number[];
};

export type LikePostParams = {
  postId: number;
  userId: number;
};

export type LikePostResult = {
  liked: boolean;
  likesCount: number;
};

// Basic types
export type UserPostParams = {
  userId: number;
  postId: number;
};

export type UserIdParams = {
  userId: number;
};

export type PostIdParams = {
  postId: number;
};

export type ArchivePostParams = {
  postId: number;
  userId: number;
  archive: boolean;
};

export type FindArchivedPostsParams = {
  userId: number;
  page?: number;
  limit?: number;
  search?: string;
  sortBy?: string;
  sortOrder?: 'ASC' | 'DESC';
};

export type FindArchivedPostsResult = {
  posts: any[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
};
