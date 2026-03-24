import { IsIn, IsOptional } from 'class-validator';
import { CollectionQueryDto } from 'src/shared/dto/collection-query.dto';
import { EVENT_SORT_BY_FIELDS } from '../types/events-query-input';

export class EventsQueryDto extends CollectionQueryDto {
  @IsOptional()
  @IsIn(EVENT_SORT_BY_FIELDS)
  sortBy?: (typeof EVENT_SORT_BY_FIELDS)[number];

  @IsOptional()
  @IsIn(['asc', 'desc'])
  sortOrder?: 'asc' | 'desc';
}
