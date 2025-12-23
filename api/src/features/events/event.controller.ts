import { FastifyRequest, FastifyReply } from "fastify";

import { eventService } from "./event.service.js";
import { EventCreateDto, EventParamsDto, EventQueryDto } from "./event.schema.js";
import { badRequestError, notFoundError } from "../../utils/httpResponses.js";

class EventController {
  async getAllEvents(request: FastifyRequest, reply: FastifyReply) {
    const result = await eventService.getAll();

    switch (result.status) {
      case "success":
        return reply.status(200).send(result.data);
    }
  }

  async getEventById(request: FastifyRequest<{ Params: EventParamsDto }>, reply: FastifyReply) {
    const { id } = request.params;
    const result = await eventService.getById(id);

    switch (result.status) {
      case "success":
        return reply.status(200).send(result.data);
      case "not_found":
        return reply.status(404).send(notFoundError(result.message));
    }
  }

  async createEvent(request: FastifyRequest<{ Body: EventCreateDto }>, reply: FastifyReply) {
    const { name, startDate, endDate } = request.body;
    const result = await eventService.create({ name, startDate, endDate });

    switch (result.status) {
      case "success":
        return reply.status(201).send(result.data);
      case "failed":
        return reply.status(400).send(badRequestError(result.message));
    }
  }

  async updateEvent(request: FastifyRequest<{ Params: EventParamsDto; Body: EventCreateDto }>, reply: FastifyReply) {
    const { id } = request.params;
    const { name, startDate, endDate } = request.body;
    const result = await eventService.update(id, { name, startDate, endDate });

    switch (result.status) {
      case "success":
        return reply.status(200).send();
      case "failed":
        return reply.status(400).send(badRequestError(result.message));
      case "not_found":
        return reply.status(404).send(notFoundError(result.message));
    }
  }

  async deleteEvent(request: FastifyRequest<{ Params: EventParamsDto }>, reply: FastifyReply) {
    const { id } = request.params;
    const result = await eventService.delete(id);

    switch (result.status) {
      case "success":
        return reply.status(204).send();
      case "not_found":
        return reply.status(404).send(notFoundError(result.message));
    }
  }

  async getEventFeaturedMatches(
    request: FastifyRequest<{ Params: EventParamsDto; Querystring: EventQueryDto }>,
    reply: FastifyReply
  ) {
    const { id } = request.params;
    const { limit } = request.query;
    const result = await eventService.getEventFeaturedMatches(id, limit);

    switch (result.status) {
      case "success":
        return reply.status(200).send(result.data);
      case "not_found":
        return reply.status(404).send(notFoundError(result.message));
    }
  }

  async getEventLeaderboard(
    request: FastifyRequest<{ Params: EventParamsDto; Querystring: EventQueryDto }>,
    reply: FastifyReply
  ) {
    const { id } = request.params;
    const { limit } = request.query;
    const result = await eventService.getEventLeaderboard(id, limit);

    switch (result.status) {
      case "success":
        return reply.status(200).send(result.data);
      case "not_found":
        return reply.status(404).send(notFoundError(result.message));
    }
  }
}

export const eventController = new EventController();
