// Server-side only (reads cookies and the API key). It is not guarded with `import "server-only"`,
// because the router is also loaded by `lib/orpc.server.ts`, which must not be guarded either.
// @see https://orpc.dev/docs/adapters/next#optimize-ssr

import { env } from "@/env";
import { createAxiosClient } from "../common/axios";
import { UsersAPI } from "./api";
import { getCookies } from "@/lib/next-request";

const usersClient = createAxiosClient({
  baseURL: env.USERS_API_URL,
});

const TOKEN_HEADER = "Authorization" as const;
const TOKEN_PREFIX = "Bearer" as const;

const API_KEY_HEADER = "X-API-Key" as const;

usersClient.interceptors.request.use(async (config) => {
  const cookiesStore = await getCookies();
  const token = cookiesStore.get("access")?.value;
  if (token) {
    config.headers[TOKEN_HEADER] = `${TOKEN_PREFIX} ${token}`;
  }
  if (env.USERS_API_KEY) {
    config.headers[API_KEY_HEADER] = env.USERS_API_KEY;
  }
  return config;
});

export const PrivateUsersApi = new UsersAPI(usersClient);
