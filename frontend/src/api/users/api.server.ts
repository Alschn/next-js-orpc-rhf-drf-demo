"server only";

import { env } from "@/env";
import { createAxiosClient } from "../common/axios";
import { UsersAPI } from "./api";
import { cookies } from "next/headers";

const usersClient = createAxiosClient({
  baseURL: env.USERS_API_URL,
});

const TOKEN_HEADER = "Authorization" as const;
const TOKEN_PREFIX = "Bearer" as const;

const API_KEY_HEADER = "X-API-Key" as const;

usersClient.interceptors.request.use(async (config) => {
  const cookiesStore = await cookies();
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
