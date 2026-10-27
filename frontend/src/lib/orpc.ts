import type { router } from "@/routers";
import type { RouterClient } from "@orpc/server";
import { createORPCClient } from "@orpc/client";
import { RPCLink } from "@orpc/client/fetch";
import { BatchLinkPlugin } from "@orpc/client/plugins";
import { createTanstackQueryUtils } from "@orpc/tanstack-query";

/**
 * This is part of the Optimize SSR setup. On the server (server components, SSR of client
 * components, server functions) `client` calls procedures directly via the router client,
 * in the browser it goes through `/rpc`. `typeof window` is replaced at build time,
 * so the router never ends up in the browser bundle.
 *
 * @see {@link https://orpc.dev/docs/adapters/next#optimize-ssr}
 */
if (typeof window === "undefined") {
  await import("./orpc.server");
}

declare global {
  var $client: RouterClient<typeof router> | undefined;
}

const link = new RPCLink({
  url: "/rpc",
  origin: () => {
    if (typeof window === "undefined") {
      throw new Error("This link is not allowed on the server side.");
    }
    return window.location.origin;
  },
  plugins: [
    new BatchLinkPlugin({
      groups: [
        {
          condition: () => true,
          context: {},
        },
      ],
    }),
  ],
});

/**
 * Fall back to a browser client when no SSR client is registered.
 */
export const client: RouterClient<typeof router> =
  globalThis.$client ?? createORPCClient(link);

export const orpc = createTanstackQueryUtils(client);
