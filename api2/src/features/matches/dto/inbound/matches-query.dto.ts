import { ApiPropertyOptional } from '@nestjs/swagger';
import { SORT_ORDERS, SortOrder } from '@shared/constants/sort-order';
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
  @ApiPropertyOptional({
    enum: MATCH_SORT_BY_FIELDS,
    description: 'default: date',
  })
  @IsOptional()
  @IsIn(MATCH_SORT_BY_FIELDS)
  sortBy?: MatchSortByFields;

  @ApiPropertyOptional({
    enum: SORT_ORDERS,
    description: 'default: asc',
  })
  @IsOptional()
  @IsIn(SORT_ORDERS)
  sortOrder?: SortOrder;

  @IsOptional()
  @IsString()
  tournamentId?: string;
}
