import { Type, Static } from "@sinclair/typebox";

export const EmailSchema = Type.String({ format: "email", maxLength: 64 });
export type Email = Static<typeof EmailSchema>;

export const PasswordSchema = Type.String({ minLength: 6, maxLength: 128 });
export type Password = Static<typeof PasswordSchema>;

export const UserRolesSchema = Type.Union([Type.Literal("user"), Type.Literal("admin"), Type.Literal("creator")]);
export type UserRoles = Static<typeof UserRolesSchema>;

export const UserSchema = Type.Object({
  id: Type.Integer({ minimum: 1 }),
  email: Type.String({ maxLength: 64 }),
  role: UserRolesSchema,
  createdAt: Type.String({ format: "date-time" }),
  updatedAt: Type.String({ format: "date-time" }),
});

export const UserParamsSchema = Type.Object({
  id: Type.Integer({ minimum: 1 }),
});
export type UserParamsDto = Static<typeof UserParamsSchema>;

export const UserQuerySchema = Type.Object({
  page: Type.Optional(Type.Integer({ minimum: 1 })),
  pageSize: Type.Optional(Type.Integer({ minimum: 1 })),
});
export type UserQueryDto = Static<typeof UserQuerySchema>;

export const UserCreateSchema = Type.Object({
  email: EmailSchema,
  password: PasswordSchema,
  role: UserRolesSchema,
});
export type UserCreateDto = Static<typeof UserCreateSchema>;

export const UserUpdateSchema = Type.Partial(UserCreateSchema);
export type UserUpdateDto = Static<typeof UserUpdateSchema>;
