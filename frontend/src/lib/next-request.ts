/**
 * Request scoped Next.js APIs for code reachable from the router.
 *
 * The router is also loaded while server-rendering client components (see `lib/orpc.ts`),
 * where Next.js rejects static `next/headers` imports, so they are imported lazily instead.
 *
 * @see {@link https://orpc.dev/docs/adapters/next#client}
 */
export async function getCookies() {
  const { cookies } = await import("next/headers");
  return cookies();
}

export async function getHeaders() {
  const { headers } = await import("next/headers");
  return headers();
}
