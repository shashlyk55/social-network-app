export class PaginationMetaDto {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export class PaginationResponseDto<T> {
  data: T[];

  meta: PaginationMetaDto;
}
