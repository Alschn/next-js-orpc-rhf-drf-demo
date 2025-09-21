"use client";

import { TokenLoginPayloadSchema } from "@/api/users/schema";
import { useServerAction } from "@orpc/react/hooks";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import z from "zod";
import { login } from "@/routers/auth";
import { onError } from "@orpc/client";

type LoginFormData = z.infer<typeof TokenLoginPayloadSchema>;

const LoginButton = ({ isLoading }: { isLoading: boolean }) => {
  return (
    <button type="submit" disabled={isLoading}>
      {isLoading ? "Logging in..." : "Login"}
    </button>
  );
};

export const LoginForm = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm<LoginFormData>({
    defaultValues: {
      username: "",
      password: "",
    },
    resolver: zodResolver(TokenLoginPayloadSchema),
  });

  const { execute, isPending: isLoading } = useServerAction(login, {
    interceptors: [
      onError((error) => {
        // todo: figure out why this error is not type-safe...
        setError("root", { type: "server", message: error.message });
      }),
    ],
  });

  const onSubmit = (data: LoginFormData) => {
    execute(data);
  };

  return (
    <div>
      <h2>Login</h2>
      <form onSubmit={handleSubmit(onSubmit)}>
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
              {...register("username")}
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
              {...register("password")}
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
