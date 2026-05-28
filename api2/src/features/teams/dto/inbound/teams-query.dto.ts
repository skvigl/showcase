import { IsIn, IsOptional } from 'class-validator';
import { CollectionQueryDto } from 'src/shared/dto/collection-query.dto';

export const TEAM_SORT_BY_FIELDS = ['name', 'createdAt', 'updatedAt'] as const;
type TeamSortByFields = (typeof TEAM_SORT_BY_FIELDS)[number];

export class TeamsQueryDto extends CollectionQueryDto {
  @IsOptional()
  @IsIn(TEAM_SORT_BY_FIELDS)
  sortBy?: TeamSortByFields;

  @IsOptional()
  @IsIn(['asc', 'desc'])
  sortOrder?: 'asc' | 'desc';
}
