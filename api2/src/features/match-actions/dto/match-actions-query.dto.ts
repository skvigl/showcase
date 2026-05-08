import { IsEnum, IsIn, IsOptional, IsString } from 'class-validator';
import { CollectionQueryDto } from 'src/shared/dto/collection-query.dto';
import { MatchActionType } from './create-match-action.dto';

export const MATCH_ACTION_SORT_BY_FIELDS = [
  'tick',
  'position',
  'type',
] as const;
type MatchActionSortByFields = (typeof MATCH_ACTION_SORT_BY_FIELDS)[number];

export class MatchActionsQueryDto extends CollectionQueryDto {
  @IsOptional()
  @IsIn(MATCH_ACTION_SORT_BY_FIELDS)
  sortBy?: MatchActionSortByFields;

  @IsOptional()
  @IsIn(['asc', 'desc'])
  sortOrder?: 'asc' | 'desc';

  @IsOptional()
  @IsString()
  matchId?: string;

  @IsOptional()
  @IsString()
  actorId?: string;

  @IsOptional()
  @IsString()
  targetId?: string;

  @IsOptional()
  @IsEnum(MatchActionType)
  type?: MatchActionType;
}
