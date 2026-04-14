import { Expose, Type } from 'class-transformer';
import { TeamWebDto } from '@features/teams/dto/web/team-web.dto';

export class PlayerWebDto {
  @Expose()
  id: string;

  @Expose()
  firstName: string;

  @Expose()
  lastName: string;

  @Expose()
  attack: number;

  @Expose()
  defence: number;

  @Expose()
  teamId: string | null;

  @Expose()
  createdAt: Date;

  @Expose()
  updatedAt: Date;

  @Expose()
  @Type(() => TeamWebDto)
  team?: TeamWebDto;
}
