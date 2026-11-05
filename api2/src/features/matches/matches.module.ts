import { Module } from '@nestjs/common';

import { MatchesService } from './matches.service';
import { MatchesController } from './matches.controller';
import { MatchesRepository } from './matches.repository';
import { RedisCacheModule } from '@shared/redis-cache/redis-cache.module';

@Module({
  imports: [RedisCacheModule.register('matches')],
  controllers: [MatchesController],
  providers: [MatchesService, MatchesRepository],
  exports: [MatchesService],
})
export class MatchesModule {}
