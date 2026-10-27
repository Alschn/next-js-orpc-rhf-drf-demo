import { UserListParams } from "@/api/users/schema";
import { UsersList } from "@/components/users-list";
import { client } from "@/lib/orpc";
import { throwPageError } from "@/lib/page-errors";
import { safe } from "@orpc/client";

const initialParams = { limit: 10, offset: 0 } satisfies UserListParams;

export default async function UsersPage() {
  const { error, data } = await safe(client.users.list(initialParams));

  if (error) {
    throwPageError(error);
  }

  return <UsersList initialData={data} initialParams={initialParams} />;
}
