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
