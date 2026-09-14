import { ApiPropertyOptional } from '@nestjs/swagger';
import { SORT_ORDERS, SortOrder } from '@shared/constants/sort-order';
import { IsIn, IsOptional } from 'class-validator';
import { CollectionQueryDto } from 'src/shared/dto/collection-query.dto';

export const USER_SORT_BY_FIELDS = ['email', 'createdAt', 'updatedAt'] as const;
type UserSortByFields = (typeof USER_SORT_BY_FIELDS)[number];

export class UsersQueryDto extends CollectionQueryDto {
  @ApiPropertyOptional({
    enum: USER_SORT_BY_FIELDS,
    description: 'default: email',
  })
  @IsOptional()
  @IsIn(USER_SORT_BY_FIELDS)
  sortBy?: UserSortByFields;

  @ApiPropertyOptional({
    enum: SORT_ORDERS,
    description: 'default: asc',
  })
  @IsOptional()
  @IsIn(SORT_ORDERS)
  sortOrder?: SortOrder;
}
