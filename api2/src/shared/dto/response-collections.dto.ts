import { Expose, Type } from 'class-transformer';

export class PaginationMetaDto {
  @Expose()
  pageNumber: number;

  @Expose()
  pageSize: number;

  @Expose()
  totalItems: number;

  @Expose()
  totalPages: number;
}

export class ResponseCollectionDto<T> {
  @Expose()
  @Type(() => Object)
  items: T[];

  @Expose()
  @Type(() => PaginationMetaDto)
  meta: PaginationMetaDto;
}
