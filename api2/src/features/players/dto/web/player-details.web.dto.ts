import { Expose, Type } from 'class-transformer';

import { TeamWebDto } from '@features/teams/dto/web/team.web.dto';

import { PlayerWebDto } from './player.web.dto';

export class PlayerDetailsWebDto extends PlayerWebDto {
  @Expose()
  @Type(() => TeamWebDto)
  team?: TeamWebDto;
}
