import { UserForm } from "@/components/user-form";
import { safe } from "@orpc/server";

interface UserPageProps {
  params: Promise<{ id: string }>;
}

export default async function UserPage({ params }: UserPageProps) {
  const { id } = await params;
  const userId = Number.parseInt(id, 10);
  if (Number.isNaN(userId)) {
    return <div>Invalid user ID</div>;
  }

  const { error, data } = await safe(
    globalThis.$client!.users.retrieve({ id: userId }),
  );

  if (error) {
    return <pre>{JSON.stringify(error, null, 2)}</pre>;
  }

  return <UserForm initialData={data} />;
}
