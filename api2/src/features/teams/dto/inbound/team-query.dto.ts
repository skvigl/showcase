import { IsIn, IsOptional } from 'class-validator';

export class TeamQueryDto {
  @IsOptional()
  @IsIn(['players'])
  include?: 'players';
}
