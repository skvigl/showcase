import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';

import { handleServiceResult } from '@shared/helpers/handle-service-results';
import { JwtAuthGuard } from '@auth/guards/auth.guard';
import { RolesGuard } from '@auth/guards/roles.guard';
import { Roles } from '@auth/decorators/roles.decorator';
import { Public } from '@auth/decorators/public.decorator';
import { Role } from '@auth/auth.types';
import { MatchActionsService } from './match-actions.service';
import { CreateMatchActionDto } from './dto/create-match-action.dto';
import { MatchActionsQueryDto } from './dto/match-actions-query.dto';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('match-actions')
export class MatchActionsController {
  constructor(private readonly matchActionsService: MatchActionsService) {}

  @Roles(Role.Creator, Role.Admin)
  @Post()
  async create(@Body() createMatchActionDto: CreateMatchActionDto) {
    const result = await this.matchActionsService.create(createMatchActionDto);

    return handleServiceResult(result);
  }

  @Public()
  @Get()
  async findAll(@Query() query: MatchActionsQueryDto) {
    const result = await this.matchActionsService.findAll(query);

    return handleServiceResult(result);
  }

  @Public()
  @Get(':id')
  async findOneById(@Param('id') id: string) {
    const result = await this.matchActionsService.findOneById(id);

    return handleServiceResult(result);
  }
}
