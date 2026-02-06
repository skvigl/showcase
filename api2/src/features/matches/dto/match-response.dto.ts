import { Expose } from 'class-transformer';

import { MatchStatus } from './create-match.dto';

export class MatchResponseDto {
  @Expose()
  id: string;

  @Expose()
  date: Date;

  @Expose()
  status: MatchStatus;

  @Expose()
  eventId: string;

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
