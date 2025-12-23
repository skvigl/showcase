import { Type, Static } from "@sinclair/typebox";

export const PlayerSchema = Type.Object({
  id: Type.Number(),
  firstName: Type.String({ minLength: 3, maxLength: 64 }),
  lastName: Type.String({ minLength: 3, maxLength: 64 }),
  power: Type.Integer({ minimum: 40, maximum: 60 }),
  teamId: Type.Union([Type.Number(), Type.Null()]),
});

export const PlayerParamsSchema = Type.Object({
  id: Type.Integer({ minimum: 1 }),
});
export type PlayerParamsDto = Static<typeof PlayerParamsSchema>;

export const PlayerQuerySchema = Type.Object({
  page: Type.Optional(Type.Integer({ minimum: 1 })),
  limit: Type.Optional(Type.Integer({ minimum: 1 })),
});

export type PlayerQueryDto = Static<typeof PlayerQuerySchema>;

export const PlayerCreateSchema = Type.Object({
  firstName: Type.String({ minLength: 3, maxLength: 64 }),
  lastName: Type.String({ minLength: 3, maxLength: 64 }),
  power: Type.Integer({ minimum: 40, maximum: 60 }),
  teamId: Type.Union([Type.Integer(), Type.Null()]),
});
export type PlayerCreateDto = Static<typeof PlayerCreateSchema>;

export const PlayerUpdateSchema = Type.Object({
  firstName: Type.String({ minLength: 3, maxLength: 64 }),
  lastName: Type.String({ minLength: 3, maxLength: 64 }),
  power: Type.Integer({ minimum: 40, maximum: 60 }),
  teamId: Type.Union([Type.Integer(), Type.Null()]),
});
export type PlayerUpdateDto = Static<typeof PlayerUpdateSchema>;
