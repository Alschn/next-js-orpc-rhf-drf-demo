import { Paginated } from "@/api/users/schema";

export function getNextPageParam(
  lastPage: Paginated<unknown>,
  _allPages?: Paginated<unknown>[],
) {
  const nextPageUrl: string | null = lastPage.next;
  if (nextPageUrl && nextPageUrl.includes("page=")) {
    const url = new URL(nextPageUrl);
    const page = url.searchParams.get("page") as string;
    const parsed = parseInt(page);
    return !isNaN(parsed) ? parsed : undefined;
  }
  return undefined;
}
