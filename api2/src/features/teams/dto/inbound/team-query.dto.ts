import { Transform } from 'class-transformer';
import { IsArray, IsIn, IsOptional } from 'class-validator';

export type TeamIncludeOption = 'players' | 'standings';

export class TeamQueryDto {
  @IsOptional()
  @Transform(({ value }: { value: unknown }): string[] | undefined => {
    if (typeof value === 'string') return value.split(',').map((v) => v.trim());
    if (Array.isArray(value)) return value;
    return undefined;
  })
  @IsArray()
  @IsIn(['players', 'standings'], { each: true })
  include?: TeamIncludeOption[];
}
