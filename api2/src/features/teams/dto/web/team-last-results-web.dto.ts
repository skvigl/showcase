import { MatchWebDto } from '@features/matches/dto/match-web.dto';
import { Expose } from 'class-transformer';

// class MatchWithResultsWebDto extends MatchWebDto {
//   results: 'W' | 'D' | ' L';
// }

export class TeamLastResultsWebDto {
  @Expose()
  items: MatchWebDto[];
}
