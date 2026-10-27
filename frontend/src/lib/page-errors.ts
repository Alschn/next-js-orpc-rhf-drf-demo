import "server-only";

import { ORPCError } from "@orpc/client";
import { forbidden, notFound, unauthorized } from "next/navigation";

/**
 * Maps remote API errors to Next.js auth interrupts / not found pages,
 * anything else is rethrown to the nearest error boundary.
 */
export function throwPageError(error: unknown): never {
  if (error instanceof ORPCError && error.code === "REMOTE_SERVER_ERROR") {
    switch (error.data?.status) {
      case 401:
        unauthorized();
      case 403:
        forbidden();
      case 404:
        notFound();
    }
  }
  throw error;
}
