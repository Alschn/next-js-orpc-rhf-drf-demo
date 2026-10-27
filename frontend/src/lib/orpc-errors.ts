import { isApiError, APIError, ApiErrorTypes } from "@/api/common/errors";
import { COMMON_ERROR_STATUS_MAP, ORPCError } from "@orpc/client";
import { ORPCErrorConstructorMap, os } from "@orpc/server";
import { AxiosResponse, isAxiosError } from "axios";
import z from "zod";

const StandardizedErrorSchema = z.object({
  code: z.string(),
  detail: z.string(),
  attr: z.string().nullable().optional(),
});

const RemoteServerErrorSchema = z.object({
  status: z.number().min(100).max(599),
  type: z.enum(Object.values(ApiErrorTypes)),
  errors: z.array(StandardizedErrorSchema).min(1),
});

export type RemoteServerErrorData = z.infer<typeof RemoteServerErrorSchema>;

export const clientWithErrors = os.errors({
  REMOTE_SERVER_ERROR: {
    data: RemoteServerErrorSchema,
  },
});

/**
 * HTTP statuses are a handler concern since oRPC v2 - errors no longer carry them.
 * The original remote API status is still available in `REMOTE_SERVER_ERROR` data.
 *
 * @see {@link https://orpc.dev/docs/migrations/from-v1#status-removed-from-errors}
 */
export const ERROR_STATUS_MAP = {
  ...COMMON_ERROR_STATUS_MAP,
  REMOTE_SERVER_ERROR: 400,
  UNHANDLED_REMOTE_SERVER_ERROR: 502,
};

type ErrorMap = ORPCErrorConstructorMap<
  (typeof clientWithErrors)["~orpc"]["errorMap"]
>;

export const remoteApiHandler = async <T>(
  promise: Promise<AxiosResponse<T>>,
  context: { errors: ErrorMap },
) => {
  try {
    const res = await promise;
    return res.data;
  } catch (err) {
    if (!isAxiosError(err) || !err.response) {
      console.error("[oRPC] Failed to call API:", err);
      throw new ORPCError("INTERNAL_SERVER_ERROR", {
        message: (err as Error).message,
        cause: err,
      });
    }
    if (!isApiError(err)) {
      console.error("[oRPC] Unexpected API Error:", err?.response?.data);
      throw new ORPCError("UNHANDLED_REMOTE_SERVER_ERROR", {
        message: err.message,
        cause: err,
      });
    }
    console.error("[oRPC] API Error:", err.response?.data);
    const apiErr = APIError.fromAxiosError(err);
    throw context.errors.REMOTE_SERVER_ERROR({
      data: {
        status: apiErr.status,
        type: apiErr.type,
        errors: apiErr.errors,
      },
    });
  }
};

export function isRemoteServerErrorWithStatus(
  error: unknown,
  status: number,
): error is ORPCError<"REMOTE_SERVER_ERROR", RemoteServerErrorData> {
  return (
    error instanceof ORPCError &&
    error.code === "REMOTE_SERVER_ERROR" &&
    error.data?.status === status
  );
}
