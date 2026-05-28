import { IsIn, IsOptional } from 'class-validator';

export class PlayerQueryDto {
  @IsOptional()
  @IsIn(['team'])
  include?: 'team';
}
