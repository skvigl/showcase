import { Module } from '@nestjs/common';

import { MatchActionsController } from './match-actions.controller';
import { MatchActionsService } from './match-actions.service';
import { MatchActionsRepository } from './match-actions.repository';
import { RedisCacheModule } from '@shared/redis-cache/redis-cache.module';

@Module({
  imports: [RedisCacheModule.register('match-actions')],
  controllers: [MatchActionsController],
  providers: [MatchActionsService, MatchActionsRepository],
  exports: [MatchActionsService],
})
export class MatchActionsModule {}
