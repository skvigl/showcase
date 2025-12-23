import { FastifyInstance } from "fastify";

import { authController } from "./auth.controller.js";
import {
  AuthLoginBodySchema,
  AuthLoginResponseSchema,
  AuthLogoutResponseSchema,
  AuthMeResponseSchema,
  AuthRefreshResponseSchema,
} from "./auth.schema.js";

export async function authRoutes(fastify: FastifyInstance) {
  fastify.post(
    "/auth/login",
    {
      schema: {
        tags: ["auth"],
        body: AuthLoginBodySchema,
        response: {
          200: AuthLoginResponseSchema,
        },
      },
    },
    authController.login
  );

  fastify.post(
    "/auth/logout",
    {
      schema: {
        tags: ["auth"],
        response: {
          200: AuthLogoutResponseSchema,
        },
      },
    },
    authController.logout
  );

  fastify.post(
    "/auth/refresh",
    {
      schema: {
        tags: ["auth"],
        response: {
          200: AuthRefreshResponseSchema,
        },
      },
    },
    authController.refresh
  );

  fastify.get(
    "/auth/me",
    {
      schema: {
        tags: ["auth"],
        response: {
          200: AuthMeResponseSchema,
        },
      },
      onRequest: async (request) => {
        await request.jwtVerify();
      },
    },
    authController.me
  );
}
