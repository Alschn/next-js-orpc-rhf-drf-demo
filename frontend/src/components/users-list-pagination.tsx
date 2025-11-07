import { useCallback, useMemo, Dispatch, SetStateAction } from "react";

const UsersListPagination = ({
  count,
  offset,
  limit,
  onQueryParamsChange,
}: {
  count: number;
  offset: number;
  limit: number;
  onQueryParamsChange: Dispatch<
    SetStateAction<{ offset: number; limit: number }>
  >;
}) => {
  const { currentPage, pageCount } = useMemo(() => {
    const currentPage = Math.floor((offset ?? 0) / limit) + 1;
    const pageCount = Math.ceil(count / limit);
    return { currentPage, pageCount };
  }, [count, offset, limit]);

  const handlePrevious = useCallback(() => {
    onQueryParamsChange((prev) => ({
      ...prev,
      offset: Math.max((prev.offset ?? 0) - prev.limit, 0),
    }));
  }, [onQueryParamsChange]);

  const handleNext = useCallback(() => {
    onQueryParamsChange((prev) => ({
      ...prev,
      offset: Math.min((prev.offset ?? 0) + prev.limit, pageCount - 1),
    }));
  }, [pageCount]);

  const handlePageSizeChange = useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      const value = Number(e.target.value);
      onQueryParamsChange((prev) => ({
        ...prev,
        limit: value,
        offset: 0,
      }));
    },
    [onQueryParamsChange],
  );

  return (
    <div style={{ display: "flex", gap: "1rem" }}>
      <button onClick={handlePrevious} disabled={currentPage <= 1}>
        Previous
      </button>
      <span>
        Page {currentPage} of {pageCount}
      </span>
      <button onClick={handleNext} disabled={currentPage >= pageCount}>
        Next
      </button>
      <label>
        Page size:
        <select defaultValue={limit} onChange={handlePageSizeChange}>
          <option value="10">10</option>
          <option value="25">25</option>
          <option value="50">50</option>
          <option value="100">100</option>
        </select>
      </label>
    </div>
  );
};

export default UsersListPagination;
