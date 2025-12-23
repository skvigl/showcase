import { FastifyReply, FastifyRequest } from "fastify";

import { authService } from "./auth.service.js";
import { unauthorizedError } from "../../utils/httpResponses.js";
import type { AuthLoginBodyDto, AuthMeResponseDto } from "./auth.schema.js";
import type { JwtPayload } from "./auth.types.js";

export class AuthController {
  async login(request: FastifyRequest<{ Body: AuthLoginBodyDto }>, reply: FastifyReply) {
    const result = await authService.login(request.body);

    switch (result.status) {
      case "success": {
        reply.setCookie("refreshToken", result.data.refreshToken, {
          httpOnly: true,
          sameSite: "lax",
          path: "/auth",
        });

        return reply.status(200).send({
          accessToken: result.data.accessToken,
        });
      }

      case "invalid_credentials":
        return reply.status(401).send(unauthorizedError("Invalid credentials"));
    }
  }

  async logout(request: FastifyRequest, reply: FastifyReply) {
    const refreshToken = request.cookies.refreshToken;

    if (refreshToken) {
      await authService.logout(refreshToken);
    }

    reply.clearCookie("refreshToken", { path: "/auth" });
    return reply.status(204).send();
  }

  async refresh(request: FastifyRequest, reply: FastifyReply) {
    const refreshToken = request.cookies.refreshToken;

    if (!refreshToken) {
      return reply.status(401).send(unauthorizedError());
    }

    const result = await authService.refresh(refreshToken);

    switch (result.status) {
      case "success": {
        reply.setCookie("refreshToken", result.data.refreshToken, {
          httpOnly: true,
          sameSite: "lax",
          path: "/auth",
        });

        return reply.status(200).send({
          accessToken: result.data.accessToken,
        });
      }

      case "unauthorized":
        return reply.status(401).send(unauthorizedError());
    }
  }

  me(request: FastifyRequest, reply: FastifyReply) {
    const user: JwtPayload = request.user;

    const dto: AuthMeResponseDto = {
      id: user.sub,
      email: user.email,
      role: user.role,
    };

    return reply.status(200).send(dto);
  }
}

export const authController = new AuthController();
