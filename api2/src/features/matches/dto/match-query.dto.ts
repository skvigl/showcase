import { Transform } from 'class-transformer';
import { IsArray, IsIn, IsOptional } from 'class-validator';

export class MatchQueryDto {
  @IsOptional()
  @Transform(({ value }: { value: unknown }): string[] | undefined => {
    if (typeof value === 'string') return value.split(',').map((v) => v.trim());
    if (Array.isArray(value)) return value;
    return undefined;
  })
  @IsArray()
  @IsIn(['tournament', 'homeTeam', 'awayTeam'], { each: true })
  include?: ('tournament' | 'homeTeam' | 'awayTeam')[];
}
