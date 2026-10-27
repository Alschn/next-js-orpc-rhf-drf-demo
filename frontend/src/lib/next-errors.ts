import { isHTTPAccessFallbackError } from "next/dist/client/components/http-access-fallback/http-access-fallback";
import { isRedirectError } from "next/dist/client/components/redirect-error";

/**
 * oRPC rethrows `redirect()` / `notFound()` / `forbidden()` / `unauthorized()` from server functions
 * so Next.js can handle them, but `useServerFunction` still returns them as errors.
 * Those are expected behaviour (Next.js already navigated), not errors per se.
 */
export function isNextNavigationError(error: unknown) {
  return isRedirectError(error) || isHTTPAccessFallbackError(error);
}
