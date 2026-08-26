import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  HttpCode,
  UseGuards,
  HttpStatus,
  ParseArrayPipe,
} from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';

import { handleServiceResult } from '@shared/helpers/handle-service-results';
import { JwtAuthGuard } from '@auth/guards/auth.guard';
import { RolesGuard } from '@auth/guards/roles.guard';
import { Roles } from '@auth/decorators/roles.decorator';
import { Public } from '@auth/decorators/public.decorator';
import { Role } from '@auth/auth.types';
import { TournamentsService } from './tournaments.service';
import { CreateTournamentDto } from './dto/inbound/create-tournament.dto';
import { UpdateTournamentDto } from './dto/inbound/update-tournament.dto';
import { TournamentsQueryDto } from './dto/inbound/tournaments-query.dto';
import { TournamentFeaturedMatchesQueryDto } from './dto/inbound/tournament-featured-matches-query.dto';
import { TournamentLeaderboardQueryDto } from './dto/inbound/tournament-leaderboard-query.dto';
import { UpdateStandingDto } from './dto/inbound/update-tournament-standings.dto';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('tournaments')
export class TournamentsController {
  constructor(private readonly tournamentsService: TournamentsService) {}

  @ApiBearerAuth()
  @Roles(Role.Creator, Role.Admin)
  @Post()
  async create(@Body() dto: CreateTournamentDto) {
    const result = await this.tournamentsService.create(dto);

    return handleServiceResult(result);
  }

  @Public()
  @Get()
  async findAll(@Query() query: TournamentsQueryDto) {
    const result = await this.tournamentsService.findAll(query);

    return handleServiceResult(result);
  }

  @Public()
  @Get(':id')
  async findOneById(@Param('id') id: string) {
    const result = await this.tournamentsService.findOneById(id);

    return handleServiceResult(result);
  }

  @ApiBearerAuth()
  @Roles(Role.Creator, Role.Admin)
  @HttpCode(HttpStatus.NO_CONTENT)
  @Patch(':id')
  async update(@Param('id') id: string, @Body() dto: UpdateTournamentDto) {
    const result = await this.tournamentsService.update(id, dto);

    handleServiceResult(result);

    return;
  }

  @ApiBearerAuth()
  @Roles(Role.Admin)
  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete(':id')
  async remove(@Param('id') id: string) {
    const result = await this.tournamentsService.remove(id);

    handleServiceResult(result);

    return;
  }

  @Public()
  @Get(':id/leaderboard')
  async getLeaderboard(
    @Param('id') id: string,
    @Query() query: TournamentLeaderboardQueryDto,
  ) {
    const result = await this.tournamentsService.getLeaderboard(
      id,
      query.limit,
    );

    return handleServiceResult(result);
  }

  @Public()
  @Get(':id/featured-matches')
  async getFeaturedMatches(
    @Param('id') id: string,
    @Query() query: TournamentFeaturedMatchesQueryDto,
  ) {
    const result = await this.tournamentsService.getFeaturedMatches(
      id,
      query.limit,
    );

    return handleServiceResult(result);
  }

  @Public()
  @Get(':id/standings')
  async getStandings(@Param('id') id: string) {
    const result = await this.tournamentsService.getStandings(id);

    return handleServiceResult(result);
  }

  @ApiBearerAuth()
  @Roles(Role.Admin)
  @HttpCode(HttpStatus.NO_CONTENT)
  @Patch(':id/standings')
  async updateStandings(
    @Param('id') id: string,
    @Body(new ParseArrayPipe({ items: UpdateStandingDto }))
    dtos: UpdateStandingDto[],
  ) {
    const result = await this.tournamentsService.updateStandings(id, dtos);

    handleServiceResult(result);

    return;
  }
}
