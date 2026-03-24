import { Module } from '@nestjs/common';
import { EventsService } from './events.service';
import { EventsController } from './events.controller';
import { EventsRepository } from './events.repository';
import { TeamsModule } from '@features/teams/teams.module';

@Module({
  controllers: [EventsController],
  providers: [EventsService, EventsRepository],
  imports: [TeamsModule],
})
export class EventsModule {}
