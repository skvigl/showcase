import { IsOptional, IsInt, Min, IsString, Max } from 'class-validator';
import { Type } from 'class-transformer';

export abstract class CollectionQueryDto {
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  pageNumber?: number = 1;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(200)
  pageSize?: number = 20;

  @IsOptional()
  @IsString()
  search?: string;
}
