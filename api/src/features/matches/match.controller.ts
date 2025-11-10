import { FastifyRequest, FastifyReply } from "fastify";

import { matchService } from "./match.service.js";
import { MatchCreateDto, MatchParamsDto, MatchUpdateDto } from "./match.schema.js";
import { badRequestError, internalError, notFoundError } from "../../utils/httpResponses.js";

export class MatchController {
  async getAllMatches(request: FastifyRequest, reply: FastifyReply) {
    const result = await matchService.getAll();

    switch (result.status) {
      case "success":
        return reply.status(200).send(result.data);
      case "fatal":
        return reply.status(500).send(internalError());
    }
  }

  async getMatchById(request: FastifyRequest<{ Params: MatchParamsDto }>, reply: FastifyReply) {
    const { id } = request.params;
    const result = await matchService.getById(id);

    switch (result.status) {
      case "success":
        return reply.status(200).send(result.data);
      case "not_found":
        return reply.status(404).send(notFoundError(result.message));
      case "fatal":
        return reply.status(500).send(internalError());
    }
  }

  async createMatch(request: FastifyRequest<{ Body: MatchCreateDto }>, reply: FastifyReply) {
    const { eventId, homeTeamId, awayTeamId, date } = request.body;
    const result = await matchService.create({ eventId, homeTeamId, awayTeamId, date });

    switch (result.status) {
      case "success":
        return reply.status(201).send(result.data);
      case "failed":
        return reply.status(400).send(badRequestError(result.message));
      case "fatal":
        return reply.status(500).send(internalError());
    }
  }

  async updateMatch(request: FastifyRequest<{ Params: MatchParamsDto; Body: MatchUpdateDto }>, reply: FastifyReply) {
    const { id } = request.params;
    const dto = request.body;

    const result = await matchService.update(id, dto);

    switch (result.status) {
      case "success":
        return reply.status(200).send();
      case "failed":
        return reply.status(400).send(badRequestError(result.message));
      case "not_found":
        return reply.status(404).send(notFoundError(result.message));
      case "fatal":
        return reply.status(500).send(internalError());
    }
  }
}

export const matchController = new MatchController();
