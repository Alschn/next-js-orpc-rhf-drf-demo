import { UserForm } from "@/components/user-form";
import { client } from "@/lib/orpc";
import { throwPageError } from "@/lib/page-errors";
import { safe } from "@orpc/client";
import { notFound } from "next/navigation";

interface UserPageProps {
  params: Promise<{ id: string }>;
}

export default async function UserPage({ params }: UserPageProps) {
  const { id } = await params;
  const userId = Number.parseInt(id, 10);
  if (Number.isNaN(userId)) {
    notFound();
  }

  const { error, data } = await safe(client.users.retrieve({ id: userId }));

  if (error) {
    throwPageError(error);
  }

  return <UserForm initialData={data} />;
}
