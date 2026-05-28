import { ApiProperty } from '@nestjs/swagger';
import { IsIn, IsOptional } from 'class-validator';
import { CollectionQueryDto } from 'src/shared/dto/collection-query.dto';

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
  @ApiProperty({ enum: PLAYER_SORT_BY_FIELDS, required: false })
  @IsOptional()
  @IsIn(PLAYER_SORT_BY_FIELDS)
  sortBy?: PlayerSortByFields;

  @ApiProperty({
    enum: ['asc', 'desc'],
    required: false,
  })
  @IsOptional()
  @IsIn(['asc', 'desc'])
  sortOrder?: 'asc' | 'desc' = 'asc';
}
