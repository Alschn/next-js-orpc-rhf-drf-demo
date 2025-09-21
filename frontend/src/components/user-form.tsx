"use client";
import { User, UserUpdateSchema } from "@/api/users/schema";
import { orpc } from "@/lib/orpc";
import { zodResolver } from "@hookform/resolvers/zod";
import { isDefinedError } from "@orpc/client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import Link from "next/link";
import { useForm } from "react-hook-form";
import z from "zod";

type UserFormData = z.infer<typeof UserUpdateSchema>;

interface UserFormProps {
  initialData: User;
}

export const UserForm = ({ initialData }: UserFormProps) => {
  const {
    register,
    handleSubmit,
    formState: { errors, isDirty },
    reset,
    setError,
  } = useForm<UserFormData>({
    defaultValues: {
      first_name: initialData.first_name,
      last_name: initialData.last_name,
      is_active: initialData.is_active,
    },
    resolver: zodResolver(UserUpdateSchema),
  });

  const queryClient = useQueryClient();

  const mutation = useMutation(
    orpc.users.update.mutationOptions({
      onSuccess: async () => {
        await queryClient.invalidateQueries({
          queryKey: orpc.users.key(),
        });
        alert("User updated successfully");
      },
      onError: (error) => {
        console.log("Error updating user: " + error.message);
        if (!isDefinedError(error)) return;
        if (error.data.type === "validation_error") {
          const fieldErrors = error.data.errors.filter(
            (e) => e.attr && e.attr in initialData,
          );
          for (const err of fieldErrors) {
            setError(err.attr as keyof UserFormData, {
              type: "server",
              message: err.detail,
            });
          }
        }
      },
    }),
  );

  const handleFormSubmit = (data: UserFormData) => {
    mutation.mutate({ id: initialData.id, ...data });
  };

  const handleReset = () => {
    reset();
  };

  const isLoading = mutation.isPending;

  return (
    <div>
      <h2>Edit User</h2>
      <div>
        <h3>Information</h3>
        <p>
          <strong>ID:</strong> {initialData.id}
        </p>
        <p>
          <strong>Username:</strong> {initialData.username}
        </p>
        <p>
          <strong>Email:</strong> {initialData.email}
        </p>
        <p>
          <strong>Is Staff:</strong> {initialData.is_staff ? "Yes" : "No"}
        </p>
      </div>
      <form onSubmit={handleSubmit(handleFormSubmit)}>
        <div>
          <label htmlFor="first_name">
            First Name
            <input
              id="first_name"
              type="text"
              {...register("first_name")}
              disabled={isLoading}
            />
          </label>
          {errors.first_name && (
            <span style={{ color: "red" }}>{errors.first_name.message}</span>
          )}
        </div>

        <div>
          <label htmlFor="last_name">
            Last Name
            <input
              id="last_name"
              type="text"
              {...register("last_name")}
              disabled={isLoading}
            />
          </label>
          {errors.last_name && (
            <span style={{ color: "red" }}>{errors.last_name.message}</span>
          )}
        </div>

        <div>
          <label htmlFor="is_active">
            <input
              id="is_active"
              type="checkbox"
              {...register("is_active")}
              disabled={isLoading}
            />
            Is Active
          </label>
          {errors.is_active && (
            <span style={{ color: "red" }}>{errors.is_active.message}</span>
          )}
        </div>

        <div>
          <button type="submit" disabled={isLoading || !isDirty}>
            {isLoading ? "Updating..." : "Update User"}
          </button>
          <button type="button" onClick={handleReset} disabled={isLoading}>
            Reset
          </button>
        </div>

        <div>
          <Link href="/users">Back to User List</Link>
        </div>
      </form>
    </div>
  );
};

export default UserForm;
