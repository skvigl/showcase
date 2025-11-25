import { FastifyInstance } from "fastify";
import { Type } from "@sinclair/typebox";

import { teamController } from "./team.controller.js";
import { TeamCreateSchema, TeamListSchema, TeamParamsSchema, TeamSchema, TeamUpdateSchema } from "./team.schema.js";
import { BadRequestErrorSchema, InternalErrorSchema, NotFoundErrorSchema } from "../../error.schema.js";
import { PlayerListSchema } from "../players/player.schema.js";
import { MatchListSchema } from "../matches/match.schema.js";

export async function teamRoutes(fastify: FastifyInstance) {
  fastify.get(
    "/teams",
    {
      schema: {
        tags: ["teams"],
        response: {
          200: TeamListSchema,
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
        body: TeamCreateSchema,
        tags: ["teams"],
        response: {
          201: TeamSchema,
          400: BadRequestErrorSchema,
          500: InternalErrorSchema,
        },
      },
    },
    teamController.createTeam
  );

  fastify.put(
    "/teams/:id",
    {
      schema: {
        params: TeamParamsSchema,
        body: TeamUpdateSchema,
        tags: ["teams"],
        response: {
          200: Type.Null(),
          400: BadRequestErrorSchema,
          404: NotFoundErrorSchema,
          500: InternalErrorSchema,
        },
      },
    },
    teamController.updateTeam
  );

  fastify.delete(
    "/teams/:id",
    {
      schema: {
        params: TeamParamsSchema,
        tags: ["teams"],
        response: {
          204: Type.Null(),
          404: NotFoundErrorSchema,
          500: InternalErrorSchema,
        },
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
          200: PlayerListSchema,
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
          200: MatchListSchema,
          404: NotFoundErrorSchema,
          500: InternalErrorSchema,
        },
      },
    },
    teamController.getTeamFeaturedMatches
  );
}
