import { IsIn, IsOptional } from 'class-validator';
import { CollectionQueryDto } from 'src/shared/dto/collection-query.dto';

export const PLAYER_SORT_BY_FIELDS = [
  'firstName',
  'lastName',
  'power',
  'createdAt',
  'updatedAt',
] as const;
type PlayerSortByFields = (typeof PLAYER_SORT_BY_FIELDS)[number];

export class PlayersQueryDto extends CollectionQueryDto {
  @IsOptional()
  @IsIn(PLAYER_SORT_BY_FIELDS)
  sortBy?: PlayerSortByFields;

  @IsOptional()
  @IsIn(['asc', 'desc'])
  sortOrder?: 'asc' | 'desc';
}
