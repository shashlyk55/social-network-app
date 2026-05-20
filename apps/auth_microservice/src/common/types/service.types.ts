export type PaginationMeta = {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
};

export type PaginationResult<T> = {
  data: T[];

  meta: PaginationMeta;
};
