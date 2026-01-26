import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './core/prisma/prisma.module';
import { TeamsModule } from './features/teams/teams.module';
import { PlayersModule } from './features/players/players.module';
@Module({
  imports: [
    ConfigModule.forRoot(),
    PrismaModule,
    TeamsModule,
    PlayersModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
