import { Injectable } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';

import { AuthRepository } from './auth.repository';
import { UsersService } from '../users/users.service';
import {
  SuccessServiceResult,
  successServiceResult,
  FailedServiceResult,
  failedServiceResult,
  FatalServiceResult,
  fatalServiceResult,
  NotFoundServiceResult,
  notFoundServiceResult,
} from 'src/shared/types/service-result';
import { AuthLoginDto } from './dto/auth-login.dto';
import { AuthTokensDto } from './dto/auth-tokens.dto';
import { ACCESS_TOKEN_TTL, REFRESH_TOKEN_TTL } from './auth.constants';

@Injectable()
export class AuthService {
  constructor(
    private readonly authRepository: AuthRepository,
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  private createPayload(user: { id: string; email: string; role: string }) {
    return { sub: user.id, email: user.email, role: user.role };
  }

  private async generateTokens(user: {
    id: string;
    email: string;
    role: string;
  }) {
    const payload = this.createPayload(user);
    const accessToken = await this.jwtService.signAsync(payload, {
      expiresIn: ACCESS_TOKEN_TTL / 1000,
      algorithm: 'HS256',
    });
    const refreshToken = randomUUID();
    const expiresAt = new Date();
    expiresAt.setTime(expiresAt.getTime() + REFRESH_TOKEN_TTL);

    return { accessToken, refreshToken, expiresAt };
  }

  async login(
    dto: AuthLoginDto,
  ): Promise<
    | SuccessServiceResult<AuthTokensDto>
    | FailedServiceResult
    | FatalServiceResult
  > {
    const userResult = await this.usersService.findOneByEmail(dto.email);

    if (userResult.status !== 'success') {
      return failedServiceResult('Invalid credentials');
    }

    const user = userResult.data;
    const ok = await bcrypt.compare(dto.password, user.password);

    if (!ok) return failedServiceResult('Invalid credentials');

    const { accessToken, refreshToken, expiresAt } =
      await this.generateTokens(user);

    const repoResult = await this.authRepository.create({
      token: refreshToken,
      userId: user.id,
      expiresAt,
    });

    switch (repoResult.status) {
      case 'success':
        return successServiceResult({
          accessToken,
          refreshToken,
        });
      case 'constraint':
        return failedServiceResult();
      case 'fatal':
      default:
        return fatalServiceResult();
    }
  }

  async logout(
    refreshToken: string,
  ): Promise<
    SuccessServiceResult<null> | NotFoundServiceResult | FatalServiceResult
  > {
    const repoResult = await this.authRepository.remove(refreshToken);

    switch (repoResult.status) {
      case 'success':
        return successServiceResult(null);
      case 'not_found':
        return notFoundServiceResult('RefreshToken', refreshToken);
      case 'fatal':
      default:
        return fatalServiceResult();
    }
  }

  async refresh(
    refreshToken: string,
  ): Promise<
    | SuccessServiceResult<AuthTokensDto>
    | NotFoundServiceResult
    | FatalServiceResult
  > {
    const tokenResult = await this.authRepository.findByToken(refreshToken);

    if (tokenResult.status !== 'success') {
      return notFoundServiceResult('RefreshToken', refreshToken);
    }

    const storedToken = tokenResult.data;
    const userResult = await this.usersService.findOneById(storedToken.userId);

    if (userResult.status !== 'success') {
      return notFoundServiceResult('User', storedToken.userId);
    }

    const user = userResult.data;
    const {
      accessToken,
      refreshToken: newRefreshToken,
      expiresAt,
    } = await this.generateTokens(user);

    const updateResult = await this.authRepository.update({
      oldToken: refreshToken,
      newToken: newRefreshToken,
      expiresAt,
    });

    switch (updateResult.status) {
      case 'success':
        return successServiceResult({
          accessToken,
          refreshToken: newRefreshToken,
        });
      case 'not_found':
        return notFoundServiceResult('RefreshToken', refreshToken);
      case 'fatal':
      default:
        return fatalServiceResult();
    }
  }
}
