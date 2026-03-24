import { Module } from '@nestjs/common';

import { MatchesModule } from '@features/matches/matches.module';
import { TeamsService } from './teams.service';
import { TeamsController } from './teams.controller';
import { TeamsRepository } from './teams.repository';

@Module({
  controllers: [TeamsController],
  providers: [TeamsService, TeamsRepository],
  imports: [MatchesModule],
  exports: [TeamsService],
})
export class TeamsModule {}
