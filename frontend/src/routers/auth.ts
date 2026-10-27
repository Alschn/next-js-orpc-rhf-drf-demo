import { PrivateUsersApi } from "@/api/users/api.server";
import { TokenLoginPayloadSchema, TokenSchema } from "@/api/users/schema";
import {
  clientWithErrors,
  isRemoteServerErrorWithStatus,
  remoteApiHandler,
} from "@/lib/orpc-errors";
import { decodeAccessToken, decodeRefreshToken } from "@/services/jwt";
import { openapi } from "@orpc/openapi";
import { getCookies } from "@/lib/next-request";

export const ACCESS_TOKEN_KEY = "access";
export const REFRESH_TOKEN_KEY = "refresh";

export const login = clientWithErrors
  .meta(openapi({ method: "POST", path: "/auth/login" }))
  .input(TokenLoginPayloadSchema)
  .output(TokenSchema)
  .handler(async ({ input, errors }) => {
    const tokens = await remoteApiHandler(PrivateUsersApi.tokenLogin(input), {
      errors,
    });
    const cookieStore = await getCookies();
    const accessToken = decodeAccessToken(tokens.access)!;
    const refreshToken = decodeRefreshToken(tokens.refresh)!;
    cookieStore.set(ACCESS_TOKEN_KEY, tokens.access, {
      httpOnly: true,
      maxAge: accessToken.exp - accessToken.iat,
    });
    cookieStore.set(REFRESH_TOKEN_KEY, tokens.refresh, {
      httpOnly: true,
      maxAge: refreshToken.exp - refreshToken.iat,
    });
    return tokens;
  });

export const logout = clientWithErrors
  .meta(openapi({ method: "POST", path: "/auth/logout" }))
  .handler(async ({ errors }) => {
    const cookieStore = await getCookies();
    // Without an access token there is no session to blacklist remotely.
    // An expired / invalid one gets rejected with 401 - in both cases the user
    // is logged out anyway, so we just clear the local session.
    if (cookieStore.has(ACCESS_TOKEN_KEY)) {
      try {
        await remoteApiHandler(PrivateUsersApi.tokenLogout(), { errors });
      } catch (error) {
        if (!isRemoteServerErrorWithStatus(error, 401)) throw error;
      }
    }
    cookieStore.delete(ACCESS_TOKEN_KEY);
    cookieStore.delete(REFRESH_TOKEN_KEY);
  });
