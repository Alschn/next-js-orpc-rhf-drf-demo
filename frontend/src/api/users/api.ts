import { AxiosClientInstance } from "../common/axios";
import { BaseAPI } from "../common/api";
import type {
  Paginated,
  TokenLoginPayload,
  TokenLoginResult,
  TokenRefreshPayload,
  TokenRefreshResult,
  TokenVerifyPayload,
  User,
  UserListParams,
} from "./schema";

export class UsersAPI extends BaseAPI {
  constructor(protected client: AxiosClientInstance) {
    super(client);
  }

  public endpoints = {
    AUTH_TOKEN: "/auth/token/",
    AUTH_TOKEN_LOGOUT: "/auth/token/logout/",
    AUTH_TOKEN_REFRESH: "/auth/token/refresh/",
    AUTH_TOKEN_VERIFY: "/auth/token/verify/",
    USERS: "/users/",
    USERS_DETAIL: "/users/{id}/",
  } as const;

  async tokenLogin(data: TokenLoginPayload) {
    return this.client.post<TokenLoginResult>(this.endpoints.AUTH_TOKEN, data);
  }

  async tokenLogout() {
    return this.client.post<Record<string, never>>(
      this.endpoints.AUTH_TOKEN_LOGOUT,
    );
  }

  async tokenRefresh(data: TokenRefreshPayload) {
    return this.client.post<TokenRefreshResult>(
      this.endpoints.AUTH_TOKEN_REFRESH,
      data,
    );
  }

  async tokenVerify(data: TokenVerifyPayload) {
    return this.client.post<Record<string, never>>(
      this.endpoints.AUTH_TOKEN_VERIFY,
      data,
    );
  }

  async listUsers(params?: UserListParams) {
    return this.client.get<Paginated<User>>(this.endpoints.USERS, { params });
  }

  async retrieveUser(id: User["id"]) {
    const url = this.makeDetailPath(this.endpoints.USERS_DETAIL, id);
    return this.client.get<User>(url);
  }

  async updateUser(id: User["id"], payload: unknown) {
    const url = this.makeDetailPath(this.endpoints.USERS_DETAIL, id);
    return this.client.patch<User>(url, payload);
  }
}
