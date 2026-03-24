import { IsIn, IsOptional, IsString } from 'class-validator';
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

  @IsOptional()
  @IsString()
  eventId?: string;

  // @IsOptional()
  // @IsString()
  // teamId?: string; // фильтр по команде (участвует в матче)

  // @IsOptional()
  // @IsString()
  // dateFrom?: Date; // начало диапазона дат

  // @IsOptional()
  // @IsString()
  // dateTo?: Date; // конец диапазона дат

  // @IsOptional()
  // @IsString()
  // status?: MatchStatus; // статус матча
}
