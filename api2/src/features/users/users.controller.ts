import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';

import { handleServiceResult } from 'src/shared/helpers/handle-service-results';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UsersQueryDto } from './dto/users-query.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  async create(@Body() createUserDto: CreateUserDto) {
    const result = await this.usersService.create(createUserDto);

    return handleServiceResult(result);
  }

  @Get()
  async findAll(@Query() query: UsersQueryDto) {
    const result = await this.usersService.findAll(query);

    return handleServiceResult(result);
  }

  @Get(':id')
  async findOneById(@Param('id') id: string) {
    const result = await this.usersService.findOneById(id);

    return handleServiceResult(result);
  }

  @Patch(':id')
  @HttpCode(204)
  async update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    const result = await this.usersService.update(id, updateUserDto);

    handleServiceResult(result);
  }

  @Delete(':id')
  @HttpCode(204)
  async remove(@Param('id') id: string) {
    const result = await this.usersService.remove(id);

    handleServiceResult(result);
  }
}
