import { type AxiosError } from "axios";

export const ApiErrorTypes = {
  /** The only error that can have more than 1 error in array. */
  VALIDATION_ERROR: "validation_error",
  /** Covers all 4xx errors other than validation errors. */
  CLIENT_ERROR: "client_error",
  /** Caused by APIException or unhandled exception. */
  SERVER_ERROR: "server_error",
} as const;

export type ApiErrorType = (typeof ApiErrorTypes)[keyof typeof ApiErrorTypes];

export const ClientErrorCodes = {
  PARSE_ERROR: "parse_error",
  AUTHENTICATION_FAILED: "authentication_failed",
  NOT_AUTHENTICATED: "not_authenticated",
  PERMISSION_DENIED: "permission_denied",
  NOT_FOUND: "not_found",
  METHOD_NOT_ALLOWED: "method_not_allowed",
  NOT_ACCEPTABLE: "not_acceptable",
  UNSUPPORTED_MEDIA_TYPE: "unsupported_media_type",
  THROTTLED: "throttled",
} as const;

export type ClientErrorCode =
  (typeof ClientErrorCodes)[keyof typeof ClientErrorCodes];

export interface ApiError {
  /** Short string describing the error */
  code: string;
  /** User-friendly text describing the error. */
  detail: string;
  /** Set only when the error type is a validation_error and maps to the serializer field name. */
  attr?: string;
}

interface ApiErrorResponse {
  type: ApiErrorType;
  errors: [ApiError, ...ApiError[]];
}

/**
 * Checks if the provided error is an API error and lets TypeScript infer the type.
 * @param error - The unknown error object to check.
 * @returns A boolean indicating whether the error is an API error.
 */
export function isApiError(
  error: unknown,
): error is AxiosError<ApiErrorResponse> {
  if (!Object.hasOwnProperty.call(error, "response")) return false;
  const err = error as AxiosError;
  if (!err.response) return false;

  const data = err.response.data;
  if (
    Object.hasOwnProperty.call(data, "type") &&
    Object.hasOwnProperty.call(data, "errors")
  )
    return true;
  return false;
}

/** 
 * Helper class to extract api errors from an existing AxiosError in a semi type safe way.
  @example const err = new APIError.fromAxiosError(axiosError);
*/
export class APIError {
  public readonly errorsWithoutAttr: ApiError[];
  public readonly errorsByAttr: Map<string, ApiError>;
  public readonly errorsByCode: Map<string, ApiError>;

  constructor(
    public status: number,
    public type: ApiErrorType,
    public errors: ApiError[],
  ) {
    this.errorsWithoutAttr = this.errors.filter((e) => !e.attr);
    this.errorsByAttr = new Map<string, ApiError>();
    this.errorsByCode = new Map<string, ApiError>();
    errors.forEach((e) => {
      if (e.attr) {
        this.errorsByAttr.set(e.attr, e);
      }
      this.errorsByCode.set(e.code, e);
    });
  }

  static fromAxiosError(error: AxiosError<ApiErrorResponse>): APIError {
    return new APIError(
      error.response!.status,
      error.response!.data.type,
      error.response!.data.errors,
    );
  }

  get codes(): string[] {
    return Array.from(this.errorsByCode.keys());
  }

  get details(): string[] {
    return this.errors.map((e) => e.detail);
  }

  get attrs(): string[] {
    return Array.from(this.errorsByAttr.keys());
  }

  getErrorByCode(code: string): ApiError | undefined {
    return this.errorsByCode.get(code);
  }

  getErrorByAttr(attr: string): ApiError | undefined {
    return this.errorsByAttr.get(attr);
  }
}
