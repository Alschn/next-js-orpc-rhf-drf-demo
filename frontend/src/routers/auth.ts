"use server";

import { PrivateUsersApi } from "@/api/users/api.server";
import { TokenLoginPayloadSchema, TokenSchema } from "@/api/users/schema";
import { clientWithErrors, remoteApiHandler } from "@/lib/orpc-errors";
import { decodeAccessToken, decodeRefreshToken } from "@/services/jwt";
import { onSuccess } from "@orpc/server";
import { cookies } from "next/headers";
import { redirect, RedirectType } from "next/navigation";

const ACCESS_TOKEN_KEY = "access";
const REFRESH_TOKEN_KEY = "refresh";
const REDIRECT_TO_ON_LOGOUT = "/login";

export const login = clientWithErrors
  .route({
    method: "POST",
    path: "/auth/login",
  })
  .input(TokenLoginPayloadSchema)
  .output(TokenSchema)
  .handler(async ({ input, errors }) => {
    return remoteApiHandler(PrivateUsersApi.tokenLogin(input), { errors });
  })
  .actionable({
    interceptors: [
      onSuccess(async (output) => {
        const { access, refresh } = output;
        const cookieStore = await cookies();
        const accessToken = decodeAccessToken(access)!;
        const refreshToken = decodeRefreshToken(refresh)!;
        const accessMaxAge = accessToken.exp - accessToken.iat;
        const refreshMaxAge = refreshToken.exp - refreshToken.iat;
        cookieStore.set(ACCESS_TOKEN_KEY, access, {
          httpOnly: true,
          maxAge: accessMaxAge,
        });
        cookieStore.set(REFRESH_TOKEN_KEY, refresh, {
          httpOnly: true,
          maxAge: refreshMaxAge,
        });
        redirect("/", RedirectType.replace);
      }),
    ],
  });

export const logout = clientWithErrors
  .route({
    method: "POST",
    path: "/auth/logout",
  })
  .handler(async ({ errors }) => {
    // todo: handle no refresh token case
    return remoteApiHandler(PrivateUsersApi.tokenLogout(), { errors });
  })
  .actionable({
    interceptors: [
      onSuccess(async () => {
        const cookieStore = await cookies();
        cookieStore.delete(ACCESS_TOKEN_KEY);
        cookieStore.delete(REFRESH_TOKEN_KEY);
        redirect(REDIRECT_TO_ON_LOGOUT);
      }),
    ],
  });
