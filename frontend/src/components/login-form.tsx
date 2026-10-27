"use client";

import { TokenLoginPayloadSchema } from "@/api/users/schema";
import { handleRHFActionError } from "@/lib/form-errors";
import { login } from "@/routers/auth";
import { zodResolver } from "@hookform/resolvers/zod";
import { onError } from "@orpc/client";
import { useServerAction } from "@orpc/react/hooks";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import z from "zod";

type LoginFormData = z.infer<typeof TokenLoginPayloadSchema>;

const LoginButton = ({ isLoading }: { isLoading: boolean }) => {
  return (
    <button type="submit" disabled={isLoading}>
      {isLoading ? "Logging in..." : "Login"}
    </button>
  );
};

export const LoginForm = () => {
  const form = useForm<LoginFormData>({
    defaultValues: {
      username: "",
      password: "",
    },
    resolver: zodResolver(TokenLoginPayloadSchema),
  });

  const { execute, isPending: isLoading } = useServerAction(login, {
    interceptors: [
      onError((error) => {
        handleRHFActionError(error, form, {
          onUndefinedError: (err) => {
            console.error("Unexpected error:", err.message);
            toast.error("An unexpected error occurred.", {
              position: "top-right",
              autoClose: 3000,
            });
          },
          onDefinedError: (error) => {
            if (error.type === "validation_error") return;
            toast.error(error.errors.map((e) => e.detail).join(", "), {
              position: "top-right",
              autoClose: 3000,
            });
          },
        });
      }),
    ],
  });

  const onSubmit = (data: LoginFormData) => {
    execute(data);
  };

  const { errors } = form.formState;

  return (
    <div>
      <h2>Login</h2>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        {errors.root && (
          <div style={{ color: "red", marginBottom: "1rem" }}>
            {errors.root.message}
          </div>
        )}

        <div>
          <label htmlFor="username">
            Username
            <input
              id="username"
              type="text"
              {...form.register("username")}
              disabled={isLoading}
              autoComplete="username"
            />
          </label>
          {errors.username && (
            <span style={{ color: "red" }}>{errors.username.message}</span>
          )}
        </div>

        <div>
          <label htmlFor="password">
            Password
            <input
              id="password"
              type="password"
              {...form.register("password")}
              disabled={isLoading}
              autoComplete="current-password"
            />
          </label>
          {errors.password && (
            <span style={{ color: "red" }}>{errors.password.message}</span>
          )}
        </div>

        <div>
          <LoginButton isLoading={isLoading} />
        </div>
      </form>
    </div>
  );
};

export default LoginForm;
