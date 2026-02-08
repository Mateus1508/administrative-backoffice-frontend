import { useState, useMemo } from "react";
import { DEFAULT_PAGE_SIZE } from "@/components/ui/pagination";
import { useCommissions } from "@/hooks/useCommissions";
import { useFilters } from "@/hooks/useFilters";
import type { Commission, CommissionFilters, CommissionStatus } from "@/types/commission";

const defaultFilters: CommissionFilters = {
  status: "",
};

export const COMMISSION_STATUS_LABELS: Record<CommissionStatus, string> = {
  pendente: "Pendente",
  paga: "Paga",
};

export interface CommissionTotalsByStatus {
  pendente: { count: number; amount: number };
  paga: { count: number; amount: number };
  total: { count: number; amount: number };
}

export function useCommissionsPage() {
  const [filterOpen, setFilterOpen] = useState(false);
  const { filters, setFilter, clearFilters, hasActiveFilters } =
    useFilters<CommissionFilters>(defaultFilters);

  const { data: commissions = [], isLoading, error } = useCommissions(filters);
  const { data: allCommissions = [] } = useCommissions({ status: "" });
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(DEFAULT_PAGE_SIZE);

  const setFilterAndResetPage = (
    key: keyof CommissionFilters,
    value: CommissionFilters[keyof CommissionFilters],
  ) => {
    setFilter(key, value);
    setPage(1);
  };

  const clearFiltersAndResetPage = () => {
    clearFilters();
    setPage(1);
  };

  const totalCommissions = commissions.length;
  const paginatedCommissions = useMemo(
    () => commissions.slice((page - 1) * pageSize, page * pageSize),
    [commissions, page, pageSize],
  );

  const totalsByStatus = useMemo<CommissionTotalsByStatus>(() => {
    const pendente = allCommissions.filter(
      (c: Commission) => c.status === "pendente",
    );
    const paga = allCommissions.filter((c: Commission) => c.status === "paga");
    return {
      pendente: {
        count: pendente.length,
        amount: pendente.reduce((sum, c) => sum + c.amount, 0),
      },
      paga: {
        count: paga.length,
        amount: paga.reduce((sum, c) => sum + c.amount, 0),
      },
      total: {
        count: allCommissions.length,
        amount: allCommissions.reduce((sum, c) => sum + c.amount, 0),
      },
    };
  }, [allCommissions]);

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
    commissions,
    isLoading,
    error,
    paginatedCommissions,
    totalCommissions,
    page,
    pageSize,
    setPage,
    onPageSizeChange: handlePageSizeChange,
    totalsByStatus,
  };
}
