"use client";

import { useServerAction } from "@orpc/react/hooks";

import { logout } from "@/routers/auth";

export const LogoutButton = () => {
  const { execute, isPending } = useServerAction(logout);

  return (
    <button onClick={execute} disabled={isPending}>
      Logout
    </button>
  );
};
