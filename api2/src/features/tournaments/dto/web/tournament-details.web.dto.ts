import { Expose, Type } from 'class-transformer';

import { MatchWebDto } from '@features/matches/dto/web/match.web.dto';

import { TournamentWebDto } from './tournament.web.dto';

export class TournamentDetailsWebDto extends TournamentWebDto {
  @Expose()
  @Type(() => MatchWebDto)
  matches?: MatchWebDto[];
}
