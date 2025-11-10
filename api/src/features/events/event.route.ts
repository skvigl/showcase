import { FastifyInstance } from "fastify";

import { eventController } from "./event.controller.js";
import { EventCreateSchema, EventParamsSchema, EventQuerySchema, EventUpdateSchema } from "./event.schema.js";

export async function eventRoutes(fastify: FastifyInstance) {
  fastify.get("/events", eventController.getAllEvents);

  fastify.post(
    "/events",
    {
      schema: {
        body: EventCreateSchema,
      },
    },
    eventController.createEvent
  );

  fastify.get(
    "/events/:id",
    {
      schema: {
        params: EventParamsSchema,
      },
    },
    eventController.getEventById
  );

  fastify.put(
    "/events/:id",
    {
      schema: {
        params: EventParamsSchema,
        body: EventUpdateSchema,
      },
    },
    eventController.updateEvent
  );

  fastify.delete(
    "/events/:id",
    {
      schema: {
        params: EventParamsSchema,
      },
    },
    eventController.deleteEvent
  );

  fastify.get(
    "/events/:id/featured-matches",
    {
      schema: {
        params: EventParamsSchema,
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
      },
    },
    eventController.getEventLeaderboard
  );
}
