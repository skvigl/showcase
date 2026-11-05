import { Module } from '@nestjs/common';
import { TournamentsService } from './tournaments.service';
import { TournamentsController } from './tournaments.controller';
import { TournamentsRepository } from './tournaments.repository';
import { TeamsModule } from '@features/teams/teams.module';
import { RedisCacheModule } from '@shared/redis-cache/redis-cache.module';

@Module({
  imports: [RedisCacheModule.register('tournaments'), TeamsModule],
  controllers: [TournamentsController],
  providers: [TournamentsService, TournamentsRepository],
})
export class TournamentsModule {}
