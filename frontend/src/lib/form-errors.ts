import { ApiErrorTypes } from "@/api/common/errors";
import { isDefinedError, ORPCError } from "@orpc/client";
import { FieldPath, FieldValues, UseFormReturn } from "react-hook-form";
import { RemoteServerErrorData } from "./orpc-errors";
import { isRedirectError } from "next/dist/client/components/redirect-error";

export function getFormFieldsFromValues<T extends Record<string, any>>(
  formValues: T,
) {
  const keys = new Set<string>();

  function addKeys(prefix: string, value: any) {
    if (Array.isArray(value)) {
      addKeys(prefix, prefix);

      value.forEach((item, index) => {
        addKeys(`${prefix}.${index}`, item);
      });
    } else if (value !== null && typeof value === "object") {
      addKeys(prefix, prefix);

      for (const [subKey, subValue] of Object.entries(value)) {
        addKeys(`${prefix}.${subKey}`, subValue);
      }
    } else {
      keys.add(prefix);
    }
  }

  for (const [key, value] of Object.entries(formValues)) {
    addKeys(key, value);
  }

  return Array.from(keys);
}

export function handleRHFApiValidationError<T extends FieldValues>(
  error: RemoteServerErrorData,
  form: UseFormReturn<T>,
) {
  if (error.type !== ApiErrorTypes.VALIDATION_ERROR) return;
  const validKeys = getFormFieldsFromValues(form.getValues());
  for (const [key, value] of Object.entries(error)) {
    let message;
    if (Array.isArray(value)) {
      message = value.join(", ");
    } else {
      message = String(value);
    }
    if (!validKeys.includes(key)) {
      form.setError("root", { type: "server", message });
    } else {
      form.setError(key as FieldPath<T>, { type: "server", message });
    }
  }
}

type OnDefinedError<T extends FieldValues> = (
  error: RemoteServerErrorData,
  form: UseFormReturn<T>,
) => void;

export type HandleRHFActionErrorOptions<T extends FieldValues> = {
  onUndefinedError?: (error: Error) => void;
  onDefinedError?: OnDefinedError<T>;
  onClientError?: OnDefinedError<T>;
  onServerError?: OnDefinedError<T>;
};

export function handleRHFActionError<T extends FieldValues>(
  error: Error | ORPCError<"REMOTE_SERVER_ERROR", RemoteServerErrorData>,
  form: UseFormReturn<T>,
  options?: HandleRHFActionErrorOptions<T>,
) {
  // oRPC onError interceptor also catches internal Next.js errors such as form action redirects,
  // we should ignore those, as they are an expected behaviour, not errors per se.
  if (isRedirectError(error)) return;

  if (!isDefinedError(error)) {
    options?.onUndefinedError?.(error);
    return;
  }

  const orpcErrorData = error.data;
  options?.onDefinedError?.(orpcErrorData, form);

  if (orpcErrorData.type === ApiErrorTypes.CLIENT_ERROR) {
    options?.onClientError?.(orpcErrorData, form);
    return;
  }

  if (error.data.type === ApiErrorTypes.SERVER_ERROR) {
    options?.onServerError?.(orpcErrorData, form);
    return;
  }

  handleRHFApiValidationError(orpcErrorData, form);
}
