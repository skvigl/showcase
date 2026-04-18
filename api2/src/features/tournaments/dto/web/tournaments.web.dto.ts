import { Type } from 'class-transformer';

import { ResponseCollectionDto } from 'src/shared/dto/response-collections.dto';
import { TournamentWebDto } from './tournament.web.dto';

export class TournamentsWebDto extends ResponseCollectionDto<TournamentWebDto> {
  @Type(() => TournamentWebDto)
  declare items: TournamentWebDto[];
}
