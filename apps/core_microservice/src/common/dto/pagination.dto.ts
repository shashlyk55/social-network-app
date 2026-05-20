import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class PaginationMetaDto {
  @ApiProperty({ description: 'Current page number' })
  @Expose()
  page: number;

  @ApiProperty({ description: 'Number of items per page' })
  @Expose()
  limit: number;

  @ApiProperty({ description: 'Total number of items' })
  @Expose()
  total: number;

  @ApiProperty({ description: 'Total number of pages' })
  @Expose()
  totalPages: number;
}

export class PaginationDto<T> {
  @ApiProperty({ description: 'Array of items' })
  @Expose()
  data: T[];

  @ApiProperty({ type: PaginationMetaDto, description: 'Pagination metadata' })
  @Expose()
  meta: PaginationMetaDto;
}
