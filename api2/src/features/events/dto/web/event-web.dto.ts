import { Expose, Type } from 'class-transformer';
import { MatchWebDto } from '@features/matches/dto/match-web.dto';

export class EventWebDto {
  @Expose()
  id: string;

  @Expose()
  name: string;

  @Expose()
  startDate: Date;

  @Expose()
  endDate: Date;

  @Expose()
  createdAt: Date;

  @Expose()
  updatedAt: Date;

  @Expose()
  @Type(() => MatchWebDto)
  matches?: MatchWebDto[];
}
