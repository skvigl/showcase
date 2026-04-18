import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './core/prisma/prisma.module';
import { TeamsModule } from './features/teams/teams.module';
import { PlayersModule } from './features/players/players.module';
import { TournamentsModule } from './features/tournaments/tournaments.module';
import { MatchesModule } from './features/matches/matches.module';
import { UsersModule } from './features/users/users.module';
import { AuthModule } from './features/auth/auth.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    PrismaModule,
    AuthModule,
    TeamsModule,
    PlayersModule,
    TournamentsModule,
    MatchesModule,
    UsersModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
