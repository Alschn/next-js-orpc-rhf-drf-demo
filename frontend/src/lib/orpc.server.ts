import { router } from "@/routers";
import { createRouterClient } from "@orpc/server";
import { getHeaders } from "./next-request";

/**
 * This is part of the Optimize SSR setup. Do not add `import "server-only"` here,
 * it would fail the build - `lib/orpc.ts` imports this file only on the server.
 *
 * @see {@link https://orpc.dev/docs/adapters/next#optimize-ssr}
 */
globalThis.$client = createRouterClient(router, {
  /**
   * Provide initial context if needed.
   *
   * Because this client instance is shared across all requests,
   * only include context that's safe to reuse globally.
   * For per-request context, use middleware context or pass a function as the initial context.
   */
  context: async () => ({
    headers: await getHeaders(), // provide headers if initial context required
  }),
});
