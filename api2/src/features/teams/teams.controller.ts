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
} from '@nestjs/common';
import { TeamsService } from './teams.service';
import { CreateTeamDto } from './dto/create-team.dto';
import { UpdateTeamDto } from './dto/update-team.dto';
import { TeamsQueryDto } from './dto/teams-query.dto';
import { handleServiceResult } from 'src/shared/helpers/handle-service-results';

@Controller('teams')
export class TeamsController {
  constructor(private readonly teamsService: TeamsService) {}

  @Post()
  async create(@Body() createTeamDto: CreateTeamDto) {
    const result = await this.teamsService.create(createTeamDto);

    return handleServiceResult(result);
  }

  @Get()
  async findAll(@Query() query: TeamsQueryDto) {
    const result = await this.teamsService.findAll(query);

    return handleServiceResult(result);
  }

  @Get(':id')
  async findOneById(@Param('id') id: string) {
    const result = await this.teamsService.findOneById(id);

    return handleServiceResult(result);
  }

  @Patch(':id')
  @HttpCode(204)
  async update(@Param('id') id: string, @Body() updateTeamDto: UpdateTeamDto) {
    const result = await this.teamsService.update(id, updateTeamDto);

    handleServiceResult(result);
  }

  @Delete(':id')
  @HttpCode(204)
  async remove(@Param('id') id: string) {
    const result = await this.teamsService.remove(id);

    handleServiceResult(result);
  }
}
