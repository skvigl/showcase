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
import { MatchesService } from './matches.service';
import { CreateMatchDto } from './dto/create-match.dto';
import { UpdateMatchDto } from './dto/update-match.dto';
import { MatchesQueryDto } from './dto/matches-query.dto';
import { handleServiceResult } from 'src/shared/helpers/handle-service-results';

@Controller('matches')
export class MatchesController {
  constructor(private readonly matchesService: MatchesService) {}

  @Post()
  async create(@Body() createMatchDto: CreateMatchDto) {
    const result = await this.matchesService.create(createMatchDto);

    return handleServiceResult(result);
  }

  @Get()
  async findAll(@Query() query: MatchesQueryDto) {
    const result = await this.matchesService.findAll(query);

    return handleServiceResult(result);
  }

  @Get(':id')
  async findOneById(@Param('id') id: string) {
    const result = await this.matchesService.findOneById(id);

    return handleServiceResult(result);
  }

  @Patch(':id')
  @HttpCode(204)
  async update(
    @Param('id') id: string,
    @Body() updateMatchDto: UpdateMatchDto,
  ) {
    const result = await this.matchesService.update(id, updateMatchDto);

    handleServiceResult(result);
  }

  @Delete(':id')
  @HttpCode(204)
  async remove(@Param('id') id: string) {
    const result = await this.matchesService.remove(id);

    handleServiceResult(result);
  }
}
