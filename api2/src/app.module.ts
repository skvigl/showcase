import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './core/prisma/prisma.module';
import { TeamsModule } from './features/teams/teams.module';
import { PlayersModule } from './features/players/players.module';
import { EventsModule } from './features/events/events.module';
import { MatchesModule } from './features/matches/matches.module';
import { UsersModule } from './features/users/users.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    PrismaModule,
    TeamsModule,
    PlayersModule,
    EventsModule,
    MatchesModule,
    UsersModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
