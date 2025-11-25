import { Type, Static } from "@sinclair/typebox";
import { TeamSchema } from "../teams/team.schema.js";

export const MatchSchema = Type.Object({
  id: Type.Integer({ minimum: 1 }),
  status: Type.String(),
  date: Type.String({ format: "date-time" }),
  eventId: Type.Integer({ minimum: 1 }),
  home: Type.Intersect([
    TeamSchema,
    Type.Object({
      score: Type.Integer({ minimum: 0 }),
    }),
  ]),
  away: Type.Intersect([
    TeamSchema,
    Type.Object({
      score: Type.Integer({ minimum: 0 }),
    }),
  ]),
});

export const MatchListSchema = Type.Array(MatchSchema);

export const MatchParamsSchema = Type.Object({
  id: Type.Integer({ minimum: 1 }),
});
export type MatchParamsDto = Static<typeof MatchParamsSchema>;

export const MatchCreateSchema = Type.Object({
  eventId: Type.Integer({ minimum: 1 }),
  homeTeamId: Type.Integer({ minimum: 1 }),
  awayTeamId: Type.Integer({ minimum: 1 }),
  date: Type.String({ format: "date-time" }),
});
export type MatchCreateDto = Static<typeof MatchCreateSchema>;

export const MatchUpdateSchema = Type.Partial(
  Type.Object({
    status: Type.String(),
    date: Type.String({ format: "date-time" }),
    eventId: Type.Integer({ minimum: 1 }),
    homeTeamId: Type.Integer({ minimum: 1 }),
    awayTeamId: Type.Integer({ minimum: 1 }),
    homeTeamScore: Type.Integer({ minimum: 0 }),
    awayTeamScore: Type.Integer({ minimum: 0 }),
  })
);
export type MatchUpdateDto = Static<typeof MatchUpdateSchema>;
