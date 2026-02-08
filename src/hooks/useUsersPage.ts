import { useState, useMemo } from "react";
import { DEFAULT_PAGE_SIZE } from "@/components/ui/pagination";
import { useUsers } from "@/hooks/useUsers";
import { useFilters } from "@/hooks/useFilters";
import { useDebouncedValue } from "@/hooks/useDebouncedValue";
import type { User, UserFilters as Filters } from "@/types/user";

const SEARCH_DEBOUNCE_MS = 1000;

const defaultFilters: Filters = {
  status: "",
  type: "",
  search: "",
};

export function useUsersPage() {
  const [filterOpen, setFilterOpen] = useState(false);
  const { filters, setFilter, clearFilters, hasActiveFilters } =
    useFilters<Filters>(defaultFilters);

  const debouncedSearch = useDebouncedValue(filters.search, SEARCH_DEBOUNCE_MS);
  const filtersForApi = useMemo<Filters>(
    () => ({ ...filters, search: debouncedSearch }),
    [filters, debouncedSearch],
  );

  const { data: users = [], isLoading, error } = useUsers(filtersForApi);
  const [detailUser, setDetailUser] = useState<User | null>(null);
  const [detailOpen, setDetailOpen] = useState(false);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(DEFAULT_PAGE_SIZE);

  const setFilterAndResetPage = (
    key: keyof Filters,
    value: Filters[keyof Filters],
  ) => {
    setFilter(key, value);
    setPage(1);
  };

  const clearFiltersAndResetPage = () => {
    clearFilters();
    setPage(1);
  };

  const totalUsers = users.length;
  const paginatedUsers = useMemo(
    () => users.slice((page - 1) * pageSize, page * pageSize),
    [users, page, pageSize],
  );

  const openDetail = (user: User) => {
    setDetailUser(user);
    setDetailOpen(true);
  };

  const closeDetail = () => {
    setDetailOpen(false);
    setDetailUser(null);
  };

  const handlePageSizeChange = (size: number) => {
    setPageSize(size);
    setPage(1);
  };

  return {
    filterOpen,
    setFilterOpen,
    filters,
    setFilterAndResetPage,
    clearFiltersAndResetPage,
    hasActiveFilters,
    users,
    isLoading,
    error,
    paginatedUsers,
    totalUsers,
    page,
    pageSize,
    setPage,
    onPageSizeChange: handlePageSizeChange,
    detailUser,
    detailOpen,
    openDetail,
    closeDetail,
  };
}
