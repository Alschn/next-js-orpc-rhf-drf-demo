"use client";

import { Paginated, User, UserListParams } from "@/api/users/schema";
import { ColumnDef, Row } from "@tanstack/react-table";
import Link from "next/link";
import { DataTable } from "./data-table";

const UserColumnActions = ({ row }: { row: Row<User> }) => {
  return (
    <Link href={`/users/${row.original.id}`}>
      <button>Details</button>
    </Link>
  );
};

const columns: ColumnDef<User>[] = [
  {
    accessorKey: "id",
    header: "ID",
  },
  {
    accessorKey: "username",
    header: "Username",
  },
  {
    accessorKey: "email",
    header: "Email",
  },
  {
    accessorKey: "first_name",
    header: "First Name",
  },
  {
    accessorKey: "last_name",
    header: "Last Name",
  },
  {
    accessorKey: "is_active",
    header: "Is Active",
    cell: ({ getValue }) => (getValue() ? "Yes" : "No"),
  },
  {
    accessorKey: "is_staff",
    header: "Is Staff",
    cell: ({ getValue }) => (getValue() ? "Yes" : "No"),
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => <UserColumnActions row={row} />,
  },
];

interface UsersListProps {
  initialData: Paginated<User>;
  initialParams: UserListParams;
}

export const UsersList = ({ initialData, initialParams }: UsersListProps) => {
  // todo: client side infinite query

  return (
    <div>
      <h1>Users</h1>
      <DataTable columns={columns} data={initialData.results} />
    </div>
  );
};
