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
  return (
    <div style={{ display: "flex", gap: "1rem" }}>
      <label>
        Search:
        <input
          type="search"
          name="search"
          placeholder="Search..."
          defaultValue=""
          onChange={(e) =>
            onQueryParamsChange((prev) => ({
              ...prev,
              search: e.target.value || undefined,
            }))
          }
        />
      </label>
      <label>
        Is Active:
        <select
          name="is_active"
          defaultValue=""
          onChange={(e) => {
            const value = e.target.value;
            onQueryParamsChange((prev) => ({
              ...prev,
              is_active: selectValueToBoolean(value),
            }));
          }}
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
          onChange={(e) => {
            const value = e.target.value;
            onQueryParamsChange((prev) => ({
              ...prev,
              is_active: selectValueToBoolean(value),
            }));
          }}
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
