import bcrypt from "bcryptjs";
import { randomUUID } from "crypto";

import { authRepository } from "./auth.repository.js";
import {
  handleServiceError,
  invalidCredentialsResult,
  successResult,
  unauthorizedResult,
} from "../../utils/serviceResult.js";
import { signJwt } from "../../utils/jwt.js";
import { userService } from "../users/user.service.js";
import type { ServiceResult } from "../../utils/serviceResult.js";
import type { AuthLoginBodyDto, AuthTokensDto } from "./auth.schema.js";
import type { User, UserCredentials } from "../../types/user.js";
import type { JwtPayload } from "./auth.types.js";

const ACCESS_TOKEN_TTL = "15m";
const REFRESH_DAYS = 30;

class AuthService {
  private createPayload(user: User | UserCredentials): JwtPayload {
    return { sub: user.id, email: user.email, role: user.role };
  }

  private generateTokens(user: User | UserCredentials) {
    const payload = this.createPayload(user);
    const accessToken = signJwt(payload, { expiresIn: ACCESS_TOKEN_TTL });
    const refreshToken = randomUUID();
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + REFRESH_DAYS);

    return { accessToken, refreshToken, expiresAt };
  }

  async login(dto: AuthLoginBodyDto): Promise<ServiceResult<AuthTokensDto>> {
    return handleServiceError(async () => {
      const userResult = await userService.getByEmail(dto.email);

      if (userResult.status !== "success") {
        return invalidCredentialsResult();
      }

      const user = userResult.data;
      const ok = await bcrypt.compare(dto.password, user.passwordHash);

      if (!ok) {
        return invalidCredentialsResult();
      }

      const { accessToken, refreshToken, expiresAt } = this.generateTokens(user);

      await authRepository.create({
        token: refreshToken,
        userId: user.id,
        expiresAt,
      });

      return successResult({ accessToken, refreshToken });
    }, "AuthService.login");
  }

  async logout(refreshToken: string): Promise<ServiceResult<null>> {
    return handleServiceError(async () => {
      await authRepository.delete(refreshToken);
      return successResult(null);
    }, "AuthService.logout");
  }

  async refresh(refreshToken: string): Promise<ServiceResult<AuthTokensDto>> {
    return handleServiceError(async () => {
      const storedToken = await authRepository.findByToken(refreshToken);

      if (!storedToken) return unauthorizedResult();

      const userResult = await userService.getById(storedToken.userId);

      if (userResult.status !== "success") return unauthorizedResult();

      const user = userResult.data;

      const { accessToken, refreshToken: newRefreshToken, expiresAt } = this.generateTokens(user);

      await authRepository.update({
        oldToken: refreshToken,
        newToken: refreshToken,
        expiresAt,
      });

      return successResult({
        accessToken,
        refreshToken: newRefreshToken,
      });
    }, "AuthService.refresh");
  }
}

export const authService = new AuthService();
