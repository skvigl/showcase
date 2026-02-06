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
import { PlayersService } from './players.service';
import { CreatePlayerDto } from './dto/create-player.dto';
import { UpdatePlayerDto } from './dto/update-player.dto';
import { PlayersQueryDto } from './dto/players-query.dto';
import { handleServiceResult } from 'src/shared/helpers/handle-service-results';

@Controller('players')
export class PlayersController {
  constructor(private readonly playersService: PlayersService) {}

  @Post()
  async create(@Body() createPlayerDto: CreatePlayerDto) {
    const result = await this.playersService.create(createPlayerDto);

    return handleServiceResult(result);
  }

  @Get()
  async findAll(@Query() query: PlayersQueryDto) {
    const result = await this.playersService.findAll(query);

    return handleServiceResult(result);
  }

  @Get(':id')
  async findOneById(@Param('id') id: string) {
    const result = await this.playersService.findOneById(id);

    return handleServiceResult(result);
  }

  @Patch(':id')
  @HttpCode(204)
  async update(
    @Param('id') id: string,
    @Body() updatePlayerDto: UpdatePlayerDto,
  ) {
    const result = await this.playersService.update(id, updatePlayerDto);

    handleServiceResult(result);
  }

  @Delete(':id')
  @HttpCode(204)
  async remove(@Param('id') id: string) {
    const result = await this.playersService.remove(id);

    handleServiceResult(result);
  }
}
