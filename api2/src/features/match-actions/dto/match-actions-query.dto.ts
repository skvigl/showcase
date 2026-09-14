import { IsEnum, IsIn, IsOptional, IsString } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

import { CollectionQueryDto } from '@shared/dto/collection-query.dto';
import { MatchActionType } from './create-match-action.dto';
import { SORT_ORDERS, SortOrder } from '@shared/constants/sort-order';

export const MATCH_ACTION_SORT_BY_FIELDS = [
  'tick',
  'position',
  'type',
] as const;
type MatchActionSortByFields = (typeof MATCH_ACTION_SORT_BY_FIELDS)[number];

export class MatchActionsQueryDto extends CollectionQueryDto {
  @ApiPropertyOptional({
    enum: MATCH_ACTION_SORT_BY_FIELDS,
    description: 'default: date',
  })
  @IsOptional()
  @IsIn(MATCH_ACTION_SORT_BY_FIELDS)
  sortBy?: MatchActionSortByFields;

  @ApiPropertyOptional({
    enum: SORT_ORDERS,
    description: 'default: asc',
  })
  @IsOptional()
  @IsIn(SORT_ORDERS)
  sortOrder?: SortOrder;

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
