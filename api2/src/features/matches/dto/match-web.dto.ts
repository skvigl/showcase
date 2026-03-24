import { Expose, Type } from 'class-transformer';

import { MatchStatus } from './create-match.dto';
import { TeamWebDto } from '@features/teams/dto/web/team-web.dto';
import { EventWebDto } from '@features/events/dto/web/event-web.dto';

export class MatchWebDto {
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

  @Expose()
  @Type(() => EventWebDto)
  event?: EventWebDto;

  @Expose()
  @Type(() => TeamWebDto)
  homeTeam?: TeamWebDto;

  @Expose()
  @Type(() => TeamWebDto)
  awayTeam?: TeamWebDto;
}
