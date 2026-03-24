import { MatchWebDto } from '@features/matches/dto/match-web.dto';
import { Expose } from 'class-transformer';

export class EventFeaturedMatchesWebDto {
  @Expose()
  items: MatchWebDto[];
}
