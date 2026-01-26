import { Module } from '@nestjs/common';
import { PlayersService } from './players.service';
import { PlayersController } from './players.controller';
import { TeamsService } from '../teams/teams.service';

@Module({
  controllers: [PlayersController],
  providers: [PlayersService, TeamsService],
})
export class PlayersModule {}
