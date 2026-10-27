import type { SortingState } from "@tanstack/react-table";

export function sortingStateToParam(sorting: SortingState) {
  return sorting.map((s) => `${s.desc ? "-" : ""}${s.id}`).join(",");
}
