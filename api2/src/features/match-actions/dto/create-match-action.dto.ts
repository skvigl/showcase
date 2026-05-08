import {
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';

export enum MatchActionType {
  grab = 'grab',
  move = 'move',
  steal = 'steal',
  knockout = 'knockout',
  score = 'score',
}

export class CreateMatchActionDto {
  @IsString()
  @IsNotEmpty()
  matchId: string;

  @IsInt()
  @Min(0)
  tick: number;

  @IsEnum(MatchActionType)
  type: MatchActionType;

  @IsString()
  @IsNotEmpty()
  actorId: string;

  @IsOptional()
  @IsString()
  targetId?: string;

  @IsInt()
  position: number;
}
