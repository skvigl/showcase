import { Type, Static } from "@sinclair/typebox";
import { EmailSchema, PasswordSchema, UserRolesSchema } from "../users/user.schema.js";

export const AuthTokensSchema = Type.Object({
  accessToken: Type.String(),
  refreshToken: Type.String(),
});
export type AuthTokensDto = Static<typeof AuthTokensSchema>;

export const AuthLoginBodySchema = Type.Object({
  email: EmailSchema,
  password: PasswordSchema,
});
export type AuthLoginBodyDto = Static<typeof AuthLoginBodySchema>;

export const AccessTokenSchema = Type.Pick(AuthTokensSchema, ["accessToken"]);
export const AuthLoginResponseSchema = AccessTokenSchema;
export type AuthLoginResponseDto = Static<typeof AuthLoginResponseSchema>;

export const AuthRefreshResponseSchema = AccessTokenSchema;
export type AuthRefreshResponseDto = Static<typeof AuthRefreshResponseSchema>;

export const AuthLogoutResponseSchema = Type.Null();
export type AuthLogoutResponseDto = Static<typeof AuthLogoutResponseSchema>;

export const AuthMeResponseSchema = Type.Object({
  id: Type.Integer({ minimum: 1 }),
  email: EmailSchema,
  role: UserRolesSchema,
});
export type AuthMeResponseDto = Static<typeof AuthMeResponseSchema>;
