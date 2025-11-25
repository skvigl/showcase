import { FastifyInstance } from "fastify";
import { Type } from "@sinclair/typebox";

import { eventController } from "./event.controller.js";
import {
  EventSchema,
  EventListSchema,
  EventCreateSchema,
  EventParamsSchema,
  EventQuerySchema,
  EventUpdateSchema,
} from "./event.schema.js";
import { BadRequestErrorSchema, InternalErrorSchema, NotFoundErrorSchema } from "../../error.schema.js";
import { MatchListSchema } from "../matches/match.schema.js";
import { TeamWithPointsSchema } from "../teams/team.schema.js";

export async function eventRoutes(fastify: FastifyInstance) {
  fastify.get(
    "/events",
    {
      schema: {
        tags: ["events"],
        response: {
          200: EventListSchema,
          500: InternalErrorSchema,
        },
      },
    },
    eventController.getAllEvents
  );

  fastify.get(
    "/events/:id",
    {
      schema: {
        params: EventParamsSchema,
        tags: ["events"],
        response: {
          200: EventSchema,
          404: NotFoundErrorSchema,
          500: InternalErrorSchema,
        },
      },
    },
    eventController.getEventById
  );

  fastify.post(
    "/events",
    {
      schema: {
        body: EventCreateSchema,
        tags: ["events"],
        response: {
          201: EventSchema,
          400: BadRequestErrorSchema,
          500: InternalErrorSchema,
        },
      },
    },
    eventController.createEvent
  );

  fastify.put(
    "/events/:id",
    {
      schema: {
        params: EventParamsSchema,
        body: EventUpdateSchema,
        tags: ["events"],
        response: {
          200: Type.Null(),
          400: BadRequestErrorSchema,
          404: NotFoundErrorSchema,
          500: InternalErrorSchema,
        },
      },
    },
    eventController.updateEvent
  );

  fastify.delete(
    "/events/:id",
    {
      schema: {
        params: EventParamsSchema,
        tags: ["events"],
        response: {
          204: Type.Null(),
          404: NotFoundErrorSchema,
          500: InternalErrorSchema,
        },
      },
    },
    eventController.deleteEvent
  );

  fastify.get(
    "/events/:id/featured-matches",
    {
      schema: {
        params: EventParamsSchema,
        tags: ["events"],
        response: {
          200: MatchListSchema,
          404: NotFoundErrorSchema,
          500: InternalErrorSchema,
        },
      },
    },
    eventController.getEventFeaturedMatches
  );

  fastify.get(
    "/events/:id/leaderboard",
    {
      schema: {
        params: EventParamsSchema,
        querystring: EventQuerySchema,
        tags: ["events"],
        response: {
          200: Type.Array(TeamWithPointsSchema),
          404: NotFoundErrorSchema,
          500: InternalErrorSchema,
        },
      },
    },
    eventController.getEventLeaderboard
  );
}
