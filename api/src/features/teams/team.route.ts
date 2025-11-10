import { FastifyInstance } from "fastify";

import * as teamController from "./team.controller.js";
import { TeamCreateSchema, TeamParamsSchema, TeamUpdateSchema } from "./team.schema.js";

export async function teamRoutes(fastify: FastifyInstance) {
  fastify.get("/teams", teamController.getAllTeams);

  fastify.post(
    "/teams",
    {
      schema: {
        body: TeamCreateSchema,
      },
    },
    teamController.createTeam
  );

  fastify.get(
    "/teams/:id",
    {
      schema: {
        params: TeamParamsSchema,
      },
    },
    teamController.getTeamById
  );

  fastify.put(
    "/teams/:id",
    {
      schema: {
        params: TeamParamsSchema,
        body: TeamUpdateSchema,
      },
    },
    teamController.updateTeam
  );

  fastify.delete(
    "/teams/:id",
    {
      schema: {
        params: TeamParamsSchema,
      },
    },
    teamController.deleteTeam
  );

  fastify.get(
    "/teams/:id/players",
    {
      schema: {
        params: TeamParamsSchema,
      },
    },
    teamController.getTeamPlayers
  );

  fastify.get(
    "/teams/:id/last-results",
    {
      schema: {
        params: TeamParamsSchema,
      },
    },
    teamController.getTeamLastResults
  );

  fastify.get(
    "/teams/:id/featured-matches",
    {
      schema: {
        params: TeamParamsSchema,
      },
    },
    teamController.getTeamFeaturedMatches
  );
}
