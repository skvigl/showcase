import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  Res,
  UnauthorizedException,
} from '@nestjs/common';
import type { Request, Response } from 'express';

import { AuthService } from './auth.service';
import { AuthLoginDto } from './dto/auth-login.dto';
import { AuthTokensResponseDto } from './dto/auth-tokens-response.dto';
import { handleServiceResult } from 'src/shared/helpers/handle-service-results';
import { ConfigService } from '@nestjs/config';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly configService: ConfigService,
  ) {}

  @HttpCode(HttpStatus.OK)
  @Post('login')
  async login(
    @Body() loginDto: AuthLoginDto,
    @Res({ passthrough: true }) res: Response,
  ): Promise<AuthTokensResponseDto> {
    const result = await this.authService.login(loginDto);
    const { accessToken, refreshToken } = handleServiceResult(result);

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      sameSite: 'lax',
      secure: this.configService.get('NODE_ENV') === 'production',
      path: '/auth',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return { accessToken };
  }

  @HttpCode(HttpStatus.NO_CONTENT)
  @Post('logout')
  async logout(@Body('refreshToken') refreshToken: string): Promise<void> {
    const result = await this.authService.logout(refreshToken);

    handleServiceResult(result);
  }

  @HttpCode(HttpStatus.OK)
  @Post('refresh')
  async refresh(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ): Promise<AuthTokensResponseDto> {
    if (typeof req.cookies?.refreshToken !== 'string') {
      throw new UnauthorizedException();
    }

    const result = await this.authService.refresh(req.cookies.refreshToken);
    const { accessToken, refreshToken } = handleServiceResult(result);

    res.cookie('refreshToken', refreshToken, { httpOnly: true });

    return { accessToken };
  }
}
