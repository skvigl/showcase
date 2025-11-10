import { Type, Static } from "@sinclair/typebox";

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
