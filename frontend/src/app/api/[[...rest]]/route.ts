import { router } from "@/routers";
import { ERROR_STATUS_MAP } from "@/lib/orpc-errors";
import { OpenAPIGenerator } from "@orpc/openapi";
import { OpenAPIHandler } from "@orpc/openapi/fetch";
import { onError } from "@orpc/server";
import { ZodToJsonSchemaConverter } from "@orpc/zod";
import { SmartCoercionHandlerPlugin } from "@orpc/json-schema";
import { OpenAPIReferenceHandlerPlugin } from "@orpc/openapi/plugins";

const PREFIX = "/api";

const generator = new OpenAPIGenerator({
  converters: [new ZodToJsonSchemaConverter()],
});

const openAPIHandler = new OpenAPIHandler(router, {
  errorStatusMap: ERROR_STATUS_MAP,
  interceptors: [
    onError((error) => {
      console.error(error);
    }),
  ],
  plugins: [
    new SmartCoercionHandlerPlugin({
      converters: [new ZodToJsonSchemaConverter()],
    }),
    new OpenAPIReferenceHandlerPlugin({
      spec: () =>
        generator.generate(router, {
          base: {
            info: {
              title: "ORPC Playground",
              version: "1.0.0",
            },
            servers: [{ url: PREFIX }],
          },
        }),
    }),
  ],
});

async function handleRequest(request: Request) {
  const { response } = await openAPIHandler.handle(request, {
    prefix: PREFIX,
    context: {},
  });

  return response ?? new Response("Not found", { status: 404 });
}

export const HEAD = handleRequest;
export const GET = handleRequest;
export const POST = handleRequest;
export const PUT = handleRequest;
export const PATCH = handleRequest;
export const DELETE = handleRequest;
