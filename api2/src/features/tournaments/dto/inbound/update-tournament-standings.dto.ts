import { IsInt, IsNotEmpty, IsString, Min } from 'class-validator';

export class UpdateStandingDto {
  @IsString()
  @IsNotEmpty()
  teamId: string;

  @IsInt()
  @Min(1)
  place: number;
}
