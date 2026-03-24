import { TeamWebDto } from '@features/teams/dto/web/team-web.dto';
import { Expose } from 'class-transformer';

export class LeaderboardItemWebDto extends TeamWebDto {
  @Expose()
  points: number;
}

export class EventLeaderboardWebDto {
  @Expose()
  items: LeaderboardItemWebDto[];
}
