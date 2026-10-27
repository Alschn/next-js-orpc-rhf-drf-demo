"use client";

import { useServerFunction } from "@orpc/next/hooks";
import { toast } from "react-toastify";

import { logout } from "@/actions/auth";
import { isNextNavigationError } from "@/lib/next-errors";

export const LogoutButton = () => {
  const { execute, isPending } = useServerFunction(logout);

  const handleClick = async () => {
    const [error] = await execute();
    if (error && !isNextNavigationError(error)) {
      console.error("Failed to log out:", error);
      toast.error("Failed to log out.", {
        position: "top-right",
        autoClose: 3000,
      });
    }
  };

  return (
    <button onClick={handleClick} disabled={isPending}>
      Logout
    </button>
  );
};
