import { IsIn, IsOptional } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

import { CollectionQueryDto } from '@shared/dto/collection-query.dto';
import { SORT_ORDERS, SortOrder } from '@shared/constants/sort-order';

export const TEAM_SORT_BY_FIELDS = ['name', 'createdAt', 'updatedAt'] as const;
type TeamSortByFields = (typeof TEAM_SORT_BY_FIELDS)[number];

export class TeamsQueryDto extends CollectionQueryDto {
  @ApiPropertyOptional({
    enum: TEAM_SORT_BY_FIELDS,
    description: 'default: name',
  })
  @IsOptional()
  @IsIn(TEAM_SORT_BY_FIELDS)
  sortBy?: TeamSortByFields;

  @ApiPropertyOptional({
    enum: SORT_ORDERS,
    description: 'default: asc',
  })
  @IsOptional()
  @IsIn(SORT_ORDERS)
  sortOrder?: SortOrder;
}
