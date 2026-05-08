import { Module } from '@nestjs/common';

import { MatchActionsController } from './match-actions.controller';
import { MatchActionsService } from './match-actions.service';
import { MatchActionsRepository } from './match-actions.repository';

@Module({
  controllers: [MatchActionsController],
  providers: [MatchActionsService, MatchActionsRepository],
  exports: [MatchActionsService],
})
export class MatchActionsModule {}
