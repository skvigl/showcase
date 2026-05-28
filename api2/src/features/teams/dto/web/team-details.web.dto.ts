import { Expose, Type } from 'class-transformer';

import { PlayerWebDto } from '@features/players/dto/web/player.web.dto';
import { TeamWebDto } from './team.web.dto';

export class TeamDetailsWebDto extends TeamWebDto {
  @Expose()
  @Type(() => PlayerWebDto)
  players?: PlayerWebDto[];
}
