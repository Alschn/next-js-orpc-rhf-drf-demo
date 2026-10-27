import { login, logout } from "./auth";
import { listUsers, retrieveUser, updateUser } from "./users";

export const router = {
  auth: {
    login,
    logout,
  },
  users: {
    list: listUsers,
    retrieve: retrieveUser,
    update: updateUser,
  },
};
