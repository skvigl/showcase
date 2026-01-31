import { Module } from '@nestjs/common';

import { EventsService } from 'src/features/events/events.service';
import { TeamsService } from 'src/features/teams/teams.service';
import { MatchesService } from './matches.service';
import { MatchesController } from './matches.controller';

@Module({
  controllers: [MatchesController],
  providers: [MatchesService],
})
export class MatchesModule {}
