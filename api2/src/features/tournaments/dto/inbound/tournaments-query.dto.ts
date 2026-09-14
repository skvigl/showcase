import { IsIn, IsOptional } from 'class-validator';
import { CollectionQueryDto } from 'src/shared/dto/collection-query.dto';
import { TOURNAMENT_SORT_BY_FIELDS } from '../../types/tournaments-query-input';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { SORT_ORDERS, SortOrder } from '@shared/constants/sort-order';

export class TournamentsQueryDto extends CollectionQueryDto {
  @ApiPropertyOptional({
    enum: TOURNAMENT_SORT_BY_FIELDS,
    description: 'default: startDate',
  })
  @IsOptional()
  @IsIn(TOURNAMENT_SORT_BY_FIELDS)
  sortBy?: (typeof TOURNAMENT_SORT_BY_FIELDS)[number];

  @ApiPropertyOptional({
    enum: SORT_ORDERS,
    description: 'default: asc',
  })
  @IsOptional()
  @IsIn(SORT_ORDERS)
  sortOrder?: SortOrder;
}
