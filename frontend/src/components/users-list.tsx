"use client";

import { Paginated, User, type UserListParams } from "@/api/users/schema";
import { orpc } from "@/lib/orpc";
import { useQuery } from "@tanstack/react-query";
import { ColumnDef, Row } from "@tanstack/react-table";
import Link from "next/link";
import { useMemo, useState } from "react";
import { DataTable } from "./data-table";
import UsersListFilters from "./users-list-filters";
import UsersListPagination from "./users-list-pagination";

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
  const [queryParams, setQueryParams] = useState<UserListParams>(initialParams);

  const { data: page } = useQuery(
    orpc.users.list.queryOptions({
      input: queryParams,
      initialData,
    }),
  );

  const data = useMemo(() => page?.results ?? [], [page]);
  const itemsCount = page?.count ?? 0;

  return (
    <div>
      <h1>Users</h1>
      <UsersListFilters onQueryParamsChange={setQueryParams} />
      <DataTable columns={columns} data={data} />
      <UsersListPagination
        count={itemsCount}
        offset={queryParams.offset}
        limit={queryParams.limit}
        onQueryParamsChange={setQueryParams}
      />
    </div>
  );
};
