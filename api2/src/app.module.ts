import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { CacheModule } from '@nestjs/cache-manager';
import KeyvRedis from '@keyv/redis';

import { AppController } from './app.controller';
import { PrismaModule } from './core/prisma/prisma.module';
import { TeamsModule } from './features/teams/teams.module';
import { PlayersModule } from './features/players/players.module';
import { TournamentsModule } from './features/tournaments/tournaments.module';
import { MatchesModule } from './features/matches/matches.module';
import { MatchActionsModule } from './features/match-actions/match-actions.module';
import { UsersModule } from './features/users/users.module';
import { AuthModule } from './features/auth/auth.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    CacheModule.registerAsync({
      isGlobal: true,
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const host = configService.getOrThrow<string>('REDIS_HOST');
        const port = configService.getOrThrow<number>('REDIS_PORT');

        return {
          stores: [new KeyvRedis(`redis://${host}:${port}`)],
        };
      },
    }),
    PrismaModule,
    AuthModule,
    TeamsModule,
    PlayersModule,
    TournamentsModule,
    MatchesModule,
    MatchActionsModule,
    UsersModule,
  ],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}
