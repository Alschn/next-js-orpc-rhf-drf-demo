import { isApiError, APIError, ApiErrorTypes } from "@/api/common/errors";
import { ORPCError } from "@orpc/client";
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
        status: 500,
        message: (err as Error).message,
      });
    }
    if (!isApiError(err)) {
      console.error("[oRPC] Unexpected API Error:", err?.response?.data);
      throw new ORPCError("UNHANDLED_REMOTE_SERVER_ERROR", {
        status: err.response!.status,
        message: err.message,
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
