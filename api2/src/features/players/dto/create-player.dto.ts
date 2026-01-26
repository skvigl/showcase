import {
  IsString,
  IsNotEmpty,
  MinLength,
  MaxLength,
  IsInt,
  Min,
  Max,
  IsOptional,
} from 'class-validator';

export class CreatePlayerDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  @MaxLength(64)
  firstName: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  @MaxLength(64)
  lastName: string;

  @IsInt()
  @Min(40)
  @Max(60)
  power: number;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  teamId?: string;
}
