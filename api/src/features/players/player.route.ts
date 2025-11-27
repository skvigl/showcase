import { FastifyInstance } from "fastify";
import { Type } from "@sinclair/typebox";

import {
  PlayerSchema,
  PlayerCreateSchema,
  PlayerParamsSchema,
  PlayerQuerySchema,
  PlayerUpdateSchema,
} from "./player.schema.js";
import {
  BadRequestErrorSchema,
  UnauthorizedErrorSchema,
  NotFoundErrorSchema,
  InternalErrorSchema,
} from "../../error.schema.js";
import { playerController } from "./player.controller.js";

export function playerRoutes(fastify: FastifyInstance) {
  fastify.get(
    "/players",
    {
      schema: {
        querystring: PlayerQuerySchema,
        tags: ["players"],
        response: {
          200: Type.Array(PlayerSchema),
          500: InternalErrorSchema,
        },
      },
    },
    playerController.getAllPlayers
  );

  fastify.get(
    "/players/:id",
    {
      schema: {
        params: PlayerParamsSchema,
        tags: ["players"],
        response: {
          200: PlayerSchema,
          404: NotFoundErrorSchema,
          500: InternalErrorSchema,
        },
      },
    },
    playerController.getPlayerById
  );

  fastify.post(
    "/players",
    {
      schema: {
        security: [{ bearerAuth: [] }],
        body: PlayerCreateSchema,
        tags: ["players"],
        response: {
          201: PlayerSchema,
          400: BadRequestErrorSchema,
          401: UnauthorizedErrorSchema,
          500: InternalErrorSchema,
        },
      },
      onRequest: async (request, reply) => {
        await request.jwtVerify();
      },
    },
    playerController.createPlayer
  );

  fastify.put(
    "/players/:id",
    {
      schema: {
        security: [{ bearerAuth: [] }],
        params: PlayerParamsSchema,
        body: PlayerUpdateSchema,
        tags: ["players"],
        response: {
          200: Type.Null(),
          400: BadRequestErrorSchema,
          401: UnauthorizedErrorSchema,
          404: NotFoundErrorSchema,
          500: InternalErrorSchema,
        },
      },
      onRequest: async (request, reply) => {
        await request.jwtVerify();
      },
    },
    playerController.updatePlayer
  );

  fastify.delete(
    "/players/:id",
    {
      schema: {
        security: [{ bearerAuth: [] }],
        params: PlayerParamsSchema,
        tags: ["players"],
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
    playerController.deletePlayer
  );
}
