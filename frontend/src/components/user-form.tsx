"use client";
import { User, UserUpdateSchema } from "@/api/users/schema";
import { handleRHFActionError } from "@/lib/form-errors";
import { orpc } from "@/lib/orpc";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import Link from "next/link";
import { useForm } from "react-hook-form";
import z from "zod";
import { toast } from "react-toastify";

type UserFormData = z.infer<typeof UserUpdateSchema>;

interface UserFormProps {
  initialData: User;
}

export const UserForm = ({ initialData }: UserFormProps) => {
  const form = useForm<UserFormData>({
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
        toast.success("User updated successfully", {
          position: "top-right",
          autoClose: 1500,
        });
      },
      onError: (error) => {
        toast.error("Failed to update user.", {
          position: "top-right",
          autoClose: 2000,
        });
        handleRHFActionError(error, form);
      },
    }),
  );

  const handleFormSubmit = (data: UserFormData) => {
    mutation.mutate({ id: initialData.id, ...data });
  };

  const handleReset = () => {
    form.reset();
  };

  const isLoading = mutation.isPending;
  const { errors, isDirty } = form.formState;

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
      <form onSubmit={form.handleSubmit(handleFormSubmit)}>
        {errors.root && (
          <div style={{ color: "red", marginBottom: "1rem" }}>
            {errors.root.message}
          </div>
        )}

        <div>
          <label htmlFor="first_name">
            First Name
            <input
              id="first_name"
              type="text"
              {...form.register("first_name")}
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
              {...form.register("last_name")}
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
              {...form.register("is_active")}
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
