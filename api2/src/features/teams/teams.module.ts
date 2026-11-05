import { Module } from '@nestjs/common';

import { RedisCacheModule } from '@shared/redis-cache/redis-cache.module';
import { MatchesModule } from '@features/matches/matches.module';
import { TeamsService } from './teams.service';
import { TeamsController } from './teams.controller';
import { TeamsRepository } from './teams.repository';

@Module({
  imports: [RedisCacheModule.register('teams'), MatchesModule],
  controllers: [TeamsController],
  providers: [TeamsService, TeamsRepository],
  exports: [TeamsService],
})
export class TeamsModule {}
