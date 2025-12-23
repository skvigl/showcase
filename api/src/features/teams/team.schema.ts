import { Type, Static } from "@sinclair/typebox";

export const TeamSchema = Type.Object({
  id: Type.Number(),
  name: Type.String({ minLength: 3, maxLength: 64 }),
});

export const TeamWithPointsSchema = Type.Intersect([
  TeamSchema,
  Type.Object({
    points: Type.Integer({ minimum: 1 }),
  }),
]);

export const TeamParamsSchema = Type.Object({
  id: Type.Integer({ minimum: 1 }),
});
export type TeamParamsDto = Static<typeof TeamParamsSchema>;

export const TeamCreateSchema = Type.Object({
  name: Type.String({ minLength: 3, maxLength: 64 }),
});
export type TeamCreateDto = Static<typeof TeamCreateSchema>;

export const TeamUpdateSchema = Type.Object({
  name: Type.String({ minLength: 3, maxLength: 64 }),
});
export type TeamUpdateDto = Static<typeof TeamUpdateSchema>;
