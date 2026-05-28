import { IsIn, IsOptional } from 'class-validator';
import { CollectionQueryDto } from 'src/shared/dto/collection-query.dto';

export const USER_SORT_BY_FIELDS = ['email', 'createdAt', 'updatedAt'] as const;
type UserSortByFields = (typeof USER_SORT_BY_FIELDS)[number];

export class UsersQueryDto extends CollectionQueryDto {
  @IsOptional()
  @IsIn(USER_SORT_BY_FIELDS)
  sortBy?: UserSortByFields;

  @IsOptional()
  @IsIn(['asc', 'desc'])
  sortOrder?: 'asc' | 'desc';
}
