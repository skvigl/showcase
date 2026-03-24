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
  power: number;

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
