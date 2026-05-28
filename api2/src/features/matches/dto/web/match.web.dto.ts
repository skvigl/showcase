import { Expose } from 'class-transformer';

import { MatchStatus } from '../inbound/create-match.dto';

export class MatchWebDto {
  @Expose()
  id: string;

  @Expose()
  date: Date;

  @Expose()
  status: MatchStatus;

  @Expose()
  duration: number;

  @Expose()
  tournamentId: string;

  @Expose()
  homeTeamId: string | null;

  @Expose()
  awayTeamId: string | null;

  @Expose()
  homeTeamScore: number;

  @Expose()
  awayTeamScore: number;

  @Expose()
  createdAt: Date;

  @Expose()
  updatedAt: Date;
}
