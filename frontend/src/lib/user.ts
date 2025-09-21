"server only";

import { cookies } from "next/headers";
import { cache } from "react";
import { decodeAccessToken, payloadToUser } from "@/services/jwt";

export async function getUserFromCookies() {
  const cookiesStore = await cookies();
  const token = cookiesStore.get("access");
  if (!token) return null;
  const decodedToken = decodeAccessToken(token.value);
  if (!decodedToken) return null;
  return payloadToUser(decodedToken);
}

export const getCachedUser = cache(getUserFromCookies);
