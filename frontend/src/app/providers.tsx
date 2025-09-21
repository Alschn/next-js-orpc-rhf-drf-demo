"use client";

import {
  QueryClient,
  QueryClientProvider as BaseQueryClientProvider,
  isServer,
} from "@tanstack/react-query";
import { type FC, type ReactNode } from "react";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

function makeQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {},
    },
  });
}

let browserQueryClient: QueryClient | undefined = undefined;

function getQueryClient() {
  if (isServer) {
    return makeQueryClient();
  } else {
    browserQueryClient ??= makeQueryClient();
    return browserQueryClient;
  }
}

interface TanstackQueryClientProviderProps {
  children: ReactNode;
}

export const QueryClientProvider: FC<TanstackQueryClientProviderProps> = ({
  children,
}) => {
  const queryClient = getQueryClient();

  return (
    <BaseQueryClientProvider client={queryClient}>
      <ReactQueryDevtools initialIsOpen={false} />
      {children}
    </BaseQueryClientProvider>
  );
};
