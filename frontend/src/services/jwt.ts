import { decode } from "jsonwebtoken";

export interface TokenUser {
  id: string;
  username: string;
  email: string;
}

interface AccessToken {
  token_type: "access";
  exp: number;
  iat: number;
  jti: string;
  sub: string;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  aud: string[];
  iss: string;
}

interface RefreshToken extends Omit<AccessToken, "token_type"> {
  token_type: "refresh";
}

export const decodeAccessToken = (token: string | undefined) => {
  if (!token) return null;
  return decode(token) as AccessToken;
};

export const decodeRefreshToken = (token: string | undefined) => {
  if (!token) return null;
  return decode(token) as RefreshToken;
};

export const payloadToUser = (payload: AccessToken) => {
  return {
    id: payload.sub,
    username: payload.username,
    email: payload.email,
  } satisfies TokenUser;
};
