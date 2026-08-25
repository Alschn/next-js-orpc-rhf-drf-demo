import { UserListParams } from "@/api/users/schema";
import { UsersList } from "@/components/users-list";
import { client } from "@/lib/orpc";
import { safe } from "@orpc/client";

const initialParams = { limit: 10, offset: 0 } satisfies UserListParams;

export default async function UsersPage() {
  const { error, data } = await safe(client.users.list(initialParams));

  if (error) {
    return <pre>{JSON.stringify(error, null, 2)}</pre>;
  }

  return <UsersList initialData={data} initialParams={initialParams} />;
}
