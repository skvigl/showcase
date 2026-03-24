import { Expose, Type } from 'class-transformer';
import { PlayerWebDto } from '../../../players/dto/player-web.dto';

export class TeamWebDto {
  @Expose()
  id: string;

  @Expose()
  name: string;

  @Expose()
  createdAt: Date;

  @Expose()
  updatedAt: Date;

  @Expose()
  @Type(() => PlayerWebDto)
  players?: PlayerWebDto[];
}
