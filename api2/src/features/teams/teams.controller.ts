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
  HttpStatus,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';

import { handleServiceResult } from '@shared/helpers/handle-service-results';
import { JwtAuthGuard } from '@auth/guards/auth.guard';
import { RolesGuard } from '@auth/guards/roles.guard';
import { Roles } from '@auth/decorators/roles.decorator';
import { Public } from '@auth/decorators/public.decorator';
import { Role } from '@auth/auth.types';
import { TeamsService } from './teams.service';
import { CreateTeamDto } from './dto/inbound/create-team.dto';
import { UpdateTeamDto } from './dto/inbound/update-team.dto';
import { TeamsQueryDto } from './dto/inbound/teams-query.dto';
import { TeamQueryDto } from './dto/inbound/team-query.dto';
import { TeamFeaturedMatchesDto } from './dto/inbound/team-featured-matches-query.dto';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('teams')
export class TeamsController {
  constructor(private readonly teamsService: TeamsService) {}

  @ApiBearerAuth()
  @Roles(Role.Creator, Role.Admin)
  @Post()
  async create(@Body() createTeamDto: CreateTeamDto) {
    const result = await this.teamsService.create(createTeamDto);

    return handleServiceResult(result);
  }

  @Public()
  @Get()
  async findAll(@Query() query: TeamsQueryDto) {
    const result = await this.teamsService.findAll(query);

    return handleServiceResult(result);
  }

  @Public()
  @Get(':id')
  async findOneById(@Param('id') id: string, @Query() query: TeamQueryDto) {
    const result = await this.teamsService.findOneById(id, query);

    return handleServiceResult(result);
  }

  @ApiBearerAuth()
  @Roles(Role.Creator, Role.Admin)
  @HttpCode(HttpStatus.NO_CONTENT)
  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateTeamDto: UpdateTeamDto) {
    const result = await this.teamsService.update(id, updateTeamDto);

    handleServiceResult(result);

    return;
  }

  @ApiBearerAuth()
  @Roles(Role.Admin)
  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete(':id')
  async remove(@Param('id') id: string) {
    const result = await this.teamsService.remove(id);

    handleServiceResult(result);

    return;
  }

  @Public()
  @Get('/:id/last-results')
  async getLastResults(
    @Param('id') id: string,
    @Query() query: TeamFeaturedMatchesDto,
  ) {
    const result = await this.teamsService.findLastResults(
      id,
      query.tournamentId,
      query.limit,
    );

    return handleServiceResult(result);
  }

  @Public()
  @Get('/:id/featured-matches')
  async getFeaturedMatches(
    @Param('id') id: string,
    @Query() query: TeamFeaturedMatchesDto,
  ) {
    const result = await this.teamsService.findFeaturedMatches(
      id,
      query.tournamentId,
      query.limit,
    );

    return handleServiceResult(result);
  }
}
