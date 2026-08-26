import { Expose, Type } from 'class-transformer';
import { ResponseCollectionDto } from 'src/shared/dto/response-collections.dto';

export class TournamentStandingWebDto {
  @Expose()
  id: string;

  @Expose()
  teamId?: string;

  @Expose()
  place: number;
}

export class TournamentStandingsWebDto extends ResponseCollectionDto<TournamentStandingWebDto> {
  @Expose()
  @Type(() => TournamentStandingWebDto)
  declare items: TournamentStandingWebDto[];
}
