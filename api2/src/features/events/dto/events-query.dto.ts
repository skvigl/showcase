import { IsIn, IsOptional } from 'class-validator';
import { CollectionQueryDto } from 'src/shared/dto/collection-query.dto';

export const EVENT_SORT_BY_FIELDS = [
  'name',
  'startDate',
  'endtDate',
  'createdAt',
  'updatedAt',
] as const;
type EventSortByFields = (typeof EVENT_SORT_BY_FIELDS)[number];

export class EventsQueryDto extends CollectionQueryDto {
  @IsOptional()
  @IsIn(EVENT_SORT_BY_FIELDS)
  sortBy?: EventSortByFields;

  @IsOptional()
  @IsIn(['asc', 'desc'])
  sortOrder?: 'asc' | 'desc';
}
