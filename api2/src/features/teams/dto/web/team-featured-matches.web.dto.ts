import { MatchWebDto } from '@features/matches/dto/web/match.web.dto';
import { Expose } from 'class-transformer';

export class TeamFeaturedMatchesWebDto {
  @Expose()
  items: MatchWebDto[];
}
