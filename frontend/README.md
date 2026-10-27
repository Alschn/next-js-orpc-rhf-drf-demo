# Frontend

Next.js app using [oRPC](https://orpc.dev) (v2) as a typesafe BFF in front of the Django REST Framework backend.

- `src/routers` - oRPC procedures proxying the DRF API (`src/api`)
- `src/lib/orpc.ts` - one `client` / `orpc` (TanStack Query utils) used everywhere: on the server it calls the
  router directly ([Optimize SSR](https://orpc.dev/docs/adapters/next#optimize-ssr)), in the browser it goes through `/rpc`
- `src/actions` - [server functions](https://orpc.dev/docs/integrations/next) wrapping the same procedures (login / logout)
- `/rpc` - RPC handler used by the browser client
- `/api` - OpenAPI handler with the Scalar API reference

## Getting Started

Set up `.env` as described in the root README, then run the development server:

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.
Open [http://localhost:3000/api](http://localhost:3000/api) to see the Scalar API reference.
