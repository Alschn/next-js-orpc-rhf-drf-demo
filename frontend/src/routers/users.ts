import { PrivateUsersApi } from "@/api/users/api.server";
import {
  PaginatedSchema,
  UserListParamsSchema,
  UserSchema,
  UserUpdateSchema,
} from "@/api/users/schema";
import { clientWithErrors, remoteApiHandler } from "@/lib/orpc-errors";

export const listUsers = clientWithErrors
  .route({
    method: "GET",
    path: "/users",
  })
  .input(UserListParamsSchema)
  .output(PaginatedSchema(UserSchema))
  .handler(async ({ input, errors }) => {
    return remoteApiHandler(PrivateUsersApi.listUsers(input), { errors });
  });

export const retrieveUser = clientWithErrors
  .route({
    method: "GET",
    path: "/users/{id}",
  })
  .input(UserSchema.pick({ id: true }))
  .output(UserSchema)
  .handler(async ({ input, errors }) => {
    return remoteApiHandler(PrivateUsersApi.retrieveUser(input.id), { errors });
  });

export const updateUser = clientWithErrors
  .route({
    method: "PATCH",
    path: "/users/{id}",
  })
  .input(UserUpdateSchema.extend({ id: UserSchema.shape.id }))
  .output(UserSchema)
  .handler(async ({ input, errors }) => {
    const { id, ...payload } = input;
    return remoteApiHandler(PrivateUsersApi.updateUser(id, payload), {
      errors,
    });
  });
