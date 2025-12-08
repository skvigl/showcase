import { FastifyInstance } from "fastify";
import { Type } from "@sinclair/typebox";

import { matchController } from "./match.controller.js";
import { MatchCreateSchema, MatchParamsSchema, MatchSchema, MatchUpdateSchema } from "./match.schema.js";
import {
  BadRequestErrorSchema,
  UnauthorizedErrorSchema,
  NotFoundErrorSchema,
  InternalErrorSchema,
} from "../../error.schema.js";

export async function matchRoutes(fastify: FastifyInstance) {
  fastify.get(
    "/matches",
    {
      schema: {
        tags: ["matches"],
        response: {
          200: Type.Array(MatchSchema),
          500: InternalErrorSchema,
        },
      },
    },
    matchController.getAllMatches
  );

  fastify.get(
    "/matches/:id",
    {
      schema: {
        params: MatchParamsSchema,
        tags: ["matches"],
        response: {
          200: MatchSchema,
          404: NotFoundErrorSchema,
          500: InternalErrorSchema,
        },
      },
    },
    matchController.getMatchById
  );

  fastify.post(
    "/matches",
    {
      schema: {
        security: [{ bearerAuth: [] }],
        body: MatchCreateSchema,
        tags: ["matches"],
        response: {
          201: MatchSchema,
          400: BadRequestErrorSchema,
          401: UnauthorizedErrorSchema,
          500: InternalErrorSchema,
        },
      },
      onRequest: async (request, reply) => {
        await request.jwtVerify();
      },
    },
    matchController.createMatch
  );

  fastify.put(
    "/matches/:id",
    {
      schema: {
        security: [{ bearerAuth: [] }],
        params: MatchParamsSchema,
        body: MatchUpdateSchema,
        tags: ["matches"],
        response: {
          200: Type.Null(),
          400: BadRequestErrorSchema,
          401: UnauthorizedErrorSchema,
          404: NotFoundErrorSchema,
          500: InternalErrorSchema,
        },
      },
      onRequest: async (request, reply) => {
        const simulatorToken = request.headers["X-Simulator-Token"];

        if (simulatorToken === process.env.SIMULATOR_TOKEN) {
          return;
        }

        await request.jwtVerify();
      },
    },
    matchController.updateMatch
  );

  fastify.delete(
    "/matches/:id",
    {
      schema: {
        security: [{ bearerAuth: [] }],
        params: MatchParamsSchema,
        tags: ["matches"],
        response: {
          204: Type.Null(),
          401: UnauthorizedErrorSchema,
          404: NotFoundErrorSchema,
          500: InternalErrorSchema,
        },
      },
      onRequest: async (request, reply) => {
        await request.jwtVerify();
      },
    },
    matchController.deleteMatch
  );
}
