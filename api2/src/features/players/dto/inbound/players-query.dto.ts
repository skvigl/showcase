import { IsIn, IsOptional } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

import { CollectionQueryDto } from '@shared/dto/collection-query.dto';
import { SORT_ORDERS, SortOrder } from '@shared/constants/sort-order';

export const PLAYER_SORT_BY_FIELDS = [
  'firstName',
  'lastName',
  'attack',
  'defence',
  'createdAt',
  'updatedAt',
] as const;
type PlayerSortByFields = (typeof PLAYER_SORT_BY_FIELDS)[number];

export class PlayersQueryDto extends CollectionQueryDto {
  @ApiPropertyOptional({
    enum: PLAYER_SORT_BY_FIELDS,
    description: 'default: firstName',
  })
  @IsOptional()
  @IsIn(PLAYER_SORT_BY_FIELDS)
  sortBy?: PlayerSortByFields;

  @ApiPropertyOptional({
    enum: SORT_ORDERS,
    description: 'default: asc',
  })
  @IsOptional()
  @IsIn(SORT_ORDERS)
  sortOrder?: SortOrder;
}
