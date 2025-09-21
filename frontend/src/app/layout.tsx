import "../lib/orpc.server";

import type { Metadata } from "next";
import { QueryClientProvider } from "./providers";

export const metadata: Metadata = {
  title: "ORPC Playground",
  description: "End-to-end typesafe APIs builder, Developer-first simplicity",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <QueryClientProvider>{children}</QueryClientProvider>
      </body>
    </html>
  );
}
