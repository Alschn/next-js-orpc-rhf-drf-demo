"use server";

import { router } from "@/routers";
import { createServerFunction } from "@orpc/next";
import { redirect, RedirectType } from "next/navigation";

const REDIRECT_TO_ON_LOGIN = "/";
const REDIRECT_TO_ON_LOGOUT = "/login";

/**
 * Server functions wrapping the very same procedures that are exposed via `/rpc` and `/api`.
 * Redirects are thrown only after the procedure succeeds, oRPC rethrows them to Next.js.
 *
 * @see {@link https://orpc.dev/docs/integrations/next#server-functions}
 */
export const login = createServerFunction(router.auth.login, {
  interceptors: [
    async ({ next }) => {
      await next();
      redirect(REDIRECT_TO_ON_LOGIN, RedirectType.replace);
    },
  ],
});

export const logout = createServerFunction(router.auth.logout, {
  interceptors: [
    async ({ next }) => {
      await next();
      redirect(REDIRECT_TO_ON_LOGOUT);
    },
  ],
});
