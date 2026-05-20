interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

interface PaginatedData<T> {
  data: T[];
  meta: PaginationMeta;
}
