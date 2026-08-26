import { Expose, Type } from 'class-transformer';
import { TournamentWebDto } from '@features/tournaments/dto/web/tournament.web.dto';

export class TeamStandingWebDto {
  @Expose()
  id: string;

  @Expose()
  tournamentId: string;

  @Expose()
  place: number;

  @Expose()
  @Type(() => TournamentWebDto)
  tournament: TournamentWebDto;
}
