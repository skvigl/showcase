import { FastifyInstance } from "fastify";
import { Type } from "@sinclair/typebox";

import { teamController } from "./team.controller.js";
import { TeamCreateSchema, TeamParamsSchema, TeamSchema, TeamUpdateSchema } from "./team.schema.js";
import {
  BadRequestErrorSchema,
  UnauthorizedErrorSchema,
  NotFoundErrorSchema,
  InternalErrorSchema,
} from "../../error.schema.js";
import { PlayerSchema } from "../players/player.schema.js";
import { MatchSchema } from "../matches/match.schema.js";

export async function teamRoutes(fastify: FastifyInstance) {
  fastify.get(
    "/teams",
    {
      schema: {
        tags: ["teams"],
        response: {
          200: Type.Array(TeamSchema),
          500: InternalErrorSchema,
        },
      },
    },
    teamController.getAllTeams
  );

  fastify.get(
    "/teams/:id",
    {
      schema: {
        params: TeamParamsSchema,
        tags: ["teams"],
        response: {
          200: TeamSchema,
          404: NotFoundErrorSchema,
          500: InternalErrorSchema,
        },
      },
    },
    teamController.getTeamById
  );

  fastify.post(
    "/teams",
    {
      schema: {
        security: [{ bearerAuth: [] }],
        body: TeamCreateSchema,
        tags: ["teams"],
        response: {
          201: TeamSchema,
          400: BadRequestErrorSchema,
          401: UnauthorizedErrorSchema,
          500: InternalErrorSchema,
        },
      },
      onRequest: async (request, reply) => {
        await request.jwtVerify();
      },
    },
    teamController.createTeam
  );

  fastify.put(
    "/teams/:id",
    {
      schema: {
        security: [{ bearerAuth: [] }],
        params: TeamParamsSchema,
        body: TeamUpdateSchema,
        tags: ["teams"],
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
    teamController.updateTeam
  );

  fastify.delete(
    "/teams/:id",
    {
      schema: {
        security: [{ bearerAuth: [] }],
        params: TeamParamsSchema,
        tags: ["teams"],
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
    teamController.deleteTeam
  );

  fastify.get(
    "/teams/:id/players",
    {
      schema: {
        params: TeamParamsSchema,
        tags: ["teams"],
        response: {
          200: Type.Array(PlayerSchema),
          404: NotFoundErrorSchema,
          500: InternalErrorSchema,
        },
      },
    },
    teamController.getTeamPlayers
  );

  fastify.get(
    "/teams/:id/last-results",
    {
      schema: {
        params: TeamParamsSchema,
        tags: ["teams"],
      },
    },
    teamController.getTeamLastResults
  );

  fastify.get(
    "/teams/:id/featured-matches",
    {
      schema: {
        params: TeamParamsSchema,
        tags: ["teams"],
        response: {
          200: Type.Array(MatchSchema),
          404: NotFoundErrorSchema,
          500: InternalErrorSchema,
        },
      },
    },
    teamController.getTeamFeaturedMatches
  );
}
