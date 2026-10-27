import { UserListParams } from "@/api/users/schema";
import { Dispatch, SetStateAction } from "react";

function selectValueToBoolean(value: string) {
  if (value === "true") return true;
  if (value === "false") return false;
  return undefined;
}

const UsersListFilters = ({
  onQueryParamsChange,
}: {
  onQueryParamsChange: Dispatch<SetStateAction<UserListParams>>;
}) => {
  // Changing a filter changes the result set, so always start from the first page.
  const setFilter = <K extends "search" | "is_active" | "is_staff">(
    key: K,
    value: UserListParams[K],
  ) => {
    onQueryParamsChange((prev) => ({ ...prev, [key]: value, offset: 0 }));
  };

  return (
    <div style={{ display: "flex", gap: "1rem" }}>
      <label>
        Search:
        <input
          type="search"
          name="search"
          placeholder="Search..."
          defaultValue=""
          onChange={(e) => setFilter("search", e.target.value || undefined)}
        />
      </label>
      <label>
        Is Active:
        <select
          name="is_active"
          defaultValue=""
          onChange={(e) =>
            setFilter("is_active", selectValueToBoolean(e.target.value))
          }
        >
          <option value="">All</option>
          <option value="true">Yes</option>
          <option value="false">No</option>
        </select>
      </label>
      <label>
        Is Staff:
        <select
          name="is_staff"
          defaultValue=""
          onChange={(e) =>
            setFilter("is_staff", selectValueToBoolean(e.target.value))
          }
        >
          <option value="">All</option>
          <option value="true">Yes</option>
          <option value="false">No</option>
        </select>
      </label>
    </div>
  );
};

export default UsersListFilters;
