"use client";

import { Paginated, User, type UserListParams } from "@/api/users/schema";
import { ColumnDef, Row } from "@tanstack/react-table";
import Link from "next/link";
import { DataTable } from "./data-table";
import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { client, orpc } from "@/lib/orpc";
import UsersListFilters from "./users-list-filters";

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

  const { data: page } = useQuery({
    queryKey: orpc.users.list.key({
      input: queryParams,
    }),
    queryFn: async () => {
      return await client.users.list(queryParams);
    },
    initialData,
  });

  const data = useMemo(() => page?.results ?? [], [page]);

  const { currentPage, pageCount } = useMemo(() => {
    const count = page?.count ?? 0;
    const currentPage =
      Math.floor((queryParams.offset ?? 0) / queryParams.limit) + 1;
    const pageCount = Math.ceil(count / queryParams.limit);
    return { currentPage, pageCount };
  }, [page, queryParams]);

  return (
    <div>
      <h1>Users</h1>
      <UsersListFilters onQueryParamsChange={setQueryParams} />
      <DataTable columns={columns} data={data} />
      <div style={{ display: "flex", gap: "1rem" }}>
        <span>
          Page {currentPage} of {pageCount}
        </span>
        <label>
          Page size:
          <select
            defaultValue={initialParams.limit}
            onChange={(e) => {
              const value = Number(e.target.value);
              setQueryParams((prev) => ({
                ...prev,
                limit: value,
                offset: 0,
              }));
            }}
          >
            <option value="10">10</option>
            <option value="25">25</option>
            <option value="50">50</option>
            <option value="100">100</option>
          </select>
        </label>
      </div>
    </div>
  );
};
