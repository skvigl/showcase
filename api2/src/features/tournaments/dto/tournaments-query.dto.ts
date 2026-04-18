import { IsIn, IsOptional } from 'class-validator';
import { CollectionQueryDto } from 'src/shared/dto/collection-query.dto';
import { TOURNAMENT_SORT_BY_FIELDS } from '../types/tournaments-query-input';

export class TournamentsQueryDto extends CollectionQueryDto {
  @IsOptional()
  @IsIn(TOURNAMENT_SORT_BY_FIELDS)
  sortBy?: (typeof TOURNAMENT_SORT_BY_FIELDS)[number];

  @IsOptional()
  @IsIn(['asc', 'desc'])
  sortOrder?: 'asc' | 'desc';
}
