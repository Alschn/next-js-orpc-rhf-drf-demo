import z from "zod";

// Auth

export const TokenLoginPayloadSchema = z.object({
  username: z.string(),
  password: z.string(),
});

export type TokenLoginPayload = z.infer<typeof TokenLoginPayloadSchema>;

export const TokenSchema = z.object({
  access: z.string(),
  refresh: z.string(),
});

export type TokenLoginResult = z.infer<typeof TokenSchema>;

export const TokenRefreshPayloadSchema = z.object({
  refresh: z.string(),
});

export type TokenRefreshPayload = z.infer<typeof TokenRefreshPayloadSchema>;

export const TokenRefreshResultSchema = TokenSchema.pick({
  access: true,
});

export type TokenRefreshResult = z.infer<typeof TokenRefreshResultSchema>;

export const TokenVerifyPayloadSchema = z.object({
  token: z.string(),
});

export type TokenVerifyPayload = z.infer<typeof TokenVerifyPayloadSchema>;

// Users

const BaseParamsSchema = z.object({
  offset: z.number().int().min(0).default(0),
  limit: z.number().int().min(1).max(100).default(10),
});

export const UserSchema = z.object({
  id: z.number().int(),
  username: z.string(),
  email: z.email(),
  first_name: z.string(),
  last_name: z.string(),
  is_active: z.boolean(),
  is_staff: z.boolean(),
});

export type User = z.infer<typeof UserSchema>;

export const UserUpdateSchema = UserSchema.pick({
  first_name: true,
  last_name: true,
  is_active: true,
});

export const UserListParamsSchema = BaseParamsSchema.extend({
  is_staff: z.boolean().optional(),
  is_active: z.boolean().optional(),
});

export type UserListParams = z.infer<typeof UserListParamsSchema>;

export const PaginatedSchema = <T extends z.ZodTypeAny>(itemSchema: T) => {
  return z.object({
    count: z.number().int(),
    next: z.string().nullable(),
    previous: z.string().nullable(),
    results: z.array(itemSchema),
  });
};

export interface Paginated<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}
