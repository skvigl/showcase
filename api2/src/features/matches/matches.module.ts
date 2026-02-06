import { Module } from '@nestjs/common';

import { MatchesService } from './matches.service';
import { MatchesController } from './matches.controller';
import { MatchesRepository } from './matches.repository';

@Module({
  controllers: [MatchesController],
  providers: [MatchesService, MatchesRepository],
})
export class MatchesModule {}
