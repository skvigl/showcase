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
} from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';

import { handleServiceResult } from '@shared/helpers/handle-service-results';
import { JwtAuthGuard } from '@auth/guards/auth.guard';
import { RolesGuard } from '@auth/guards/roles.guard';
import { Roles } from '@auth/decorators/roles.decorator';
import { Public } from '@auth/decorators/public.decorator';
import { Role } from '@auth/auth.types';
import { MatchesService } from './matches.service';
import { CreateMatchDto } from './dto/inbound/create-match.dto';
import { UpdateMatchDto } from './dto/inbound/update-match.dto';
import { MatchesQueryDto } from './dto/inbound/matches-query.dto';
import { MatchQueryDto } from './dto/inbound/match-query.dto';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('matches')
export class MatchesController {
  constructor(private readonly matchesService: MatchesService) {}

  @ApiBearerAuth()
  @Roles(Role.Creator, Role.Admin)
  @Post()
  async create(@Body() createMatchDto: CreateMatchDto) {
    const result = await this.matchesService.create(createMatchDto);

    return handleServiceResult(result);
  }

  @Public()
  @Get()
  async findAll(@Query() query: MatchesQueryDto) {
    const result = await this.matchesService.findAll(query);

    return handleServiceResult(result);
  }

  @Public()
  @Get(':id')
  async findOneById(@Param('id') id: string, @Query() query: MatchQueryDto) {
    const result = await this.matchesService.findOneById(id, query);

    return handleServiceResult(result);
  }

  @ApiBearerAuth()
  @Roles(Role.Creator, Role.Admin)
  @HttpCode(HttpStatus.NO_CONTENT)
  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateMatchDto: UpdateMatchDto,
  ) {
    const result = await this.matchesService.update(id, updateMatchDto);

    handleServiceResult(result);

    return;
  }

  @ApiBearerAuth()
  @Roles(Role.Admin)
  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete(':id')
  async remove(@Param('id') id: string) {
    const result = await this.matchesService.remove(id);

    handleServiceResult(result);

    return;
  }
}
