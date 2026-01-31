import {
  IsString,
  IsNotEmpty,
  IsDateString,
  IsEnum,
  IsOptional,
  IsInt,
  Min,
} from 'class-validator';

export enum MatchStatus {
  scheduled = 'scheduled',
  live = 'live',
  finished = 'finished',
}

export class CreateMatchDto {
  @IsDateString()
  @IsNotEmpty()
  date: string;

  @IsEnum(MatchStatus)
  @IsOptional()
  status?: MatchStatus;

  @IsString()
  @IsNotEmpty()
  eventId: string;

  @IsOptional()
  @IsString()
  homeTeamId?: string;

  @IsOptional()
  @IsString()
  awayTeamId?: string;

  @IsInt()
  @Min(0)
  @IsOptional()
  homeTeamScore?: number;

  @IsInt()
  @Min(0)
  @IsOptional()
  awayTeamScore?: number;
}
