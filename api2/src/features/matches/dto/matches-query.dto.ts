import { IsIn, IsOptional } from 'class-validator';
import { CollectionQueryDto } from 'src/shared/dto/collection-query.dto';

export const MATCH_SORT_BY_FIELDS = [
  'date',
  'status',
  'createdAt',
  'updatedAt',
] as const;
type MatchSortByFields = (typeof MATCH_SORT_BY_FIELDS)[number];

export class MatchesQueryDto extends CollectionQueryDto {
  @IsOptional()
  @IsIn(MATCH_SORT_BY_FIELDS)
  sortBy?: MatchSortByFields;

  @IsOptional()
  @IsIn(['asc', 'desc'])
  sortOrder?: 'asc' | 'desc';
}
