import { Expose, Type } from 'class-transformer';

import { TeamWebDto } from '@features/teams/dto/web/team.web.dto';
import { TournamentWebDto } from '@features/tournaments/dto/web/tournament.web.dto';

import { MatchWebDto } from './match.web.dto';

export class MatchDetailsWebDto extends MatchWebDto {
  @Expose()
  @Type(() => TournamentWebDto)
  tournament?: TournamentWebDto;

  @Expose()
  @Type(() => TeamWebDto)
  homeTeam?: TeamWebDto;

  @Expose()
  @Type(() => TeamWebDto)
  awayTeam?: TeamWebDto;
}
