import { Module } from '@nestjs/common';
import { TournamentsService } from './tournaments.service';
import { TournamentsController } from './tournaments.controller';
import { TournamentsRepository } from './tournaments.repository';
import { TeamsModule } from '@features/teams/teams.module';

@Module({
  controllers: [TournamentsController],
  providers: [TournamentsService, TournamentsRepository],
  imports: [TeamsModule],
})
export class TournamentsModule {}
