import { Type, Static } from "@sinclair/typebox";

export const EventSchema = Type.Object({
  id: Type.Integer({ minimum: 1 }),
  name: Type.String({ minLength: 3, maxLength: 64 }),
  startDate: Type.String({ format: "date-time" }),
  endDate: Type.String({ format: "date-time" }),
});

export const EventListSchema = Type.Array(EventSchema);

export const EventParamsSchema = Type.Object({
  id: Type.Integer({ minimum: 1 }),
});
export type EventParamsDto = Static<typeof EventParamsSchema>;

export const EventQuerySchema = Type.Object({
  limit: Type.Optional(Type.Integer({ minimum: 1 })),
});
export type EventQueryDto = Static<typeof EventQuerySchema>;

export const EventCreateSchema = Type.Object({
  name: Type.String({ minLength: 3, maxLength: 64 }),
  startDate: Type.String({ format: "date-time" }),
  endDate: Type.String({ format: "date-time" }),
});
export type EventCreateDto = Static<typeof EventCreateSchema>;

export const EventUpdateSchema = Type.Object({
  name: Type.String({ minLength: 3, maxLength: 64 }),
  startDate: Type.String({ format: "date-time" }),
  endDate: Type.String({ format: "date-time" }),
});
export type EventUpdateDto = Static<typeof EventUpdateSchema>;
