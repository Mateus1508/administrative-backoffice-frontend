import { useState, useMemo } from "react";
import { DEFAULT_PAGE_SIZE } from "@/components/ui/pagination";
import { useOrders } from "@/hooks/useOrders";
import { useFilters } from "@/hooks/useFilters";
import type { Order, OrderFilters, OrderStatus } from "@/types/order";

const defaultFilters: OrderFilters = {
  status: "",
  dateFrom: "",
  dateTo: "",
};

export const ORDER_STATUS_LABELS: Record<OrderStatus, string> = {
  pendente: "Pendente",
  processando: "Processando",
  entregue: "Entregue",
  cancelado: "Cancelado",
};

export function useOrdersPage() {
  const [filterOpen, setFilterOpen] = useState(false);
  const { filters, setFilter, clearFilters, hasActiveFilters } =
    useFilters<OrderFilters>(defaultFilters);

  const { data: orders = [], isLoading, error } = useOrders(filters);
  const [detailOrder, setDetailOrder] = useState<Order | null>(null);
  const [detailOpen, setDetailOpen] = useState(false);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(DEFAULT_PAGE_SIZE);

  const setFilterAndResetPage = (
    key: keyof OrderFilters,
    value: OrderFilters[keyof OrderFilters],
  ) => {
    setFilter(key, value);
    setPage(1);
  };

  const clearFiltersAndResetPage = () => {
    clearFilters();
    setPage(1);
  };

  const totalOrders = orders.length;
  const paginatedOrders = useMemo(
    () => orders.slice((page - 1) * pageSize, page * pageSize),
    [orders, page, pageSize],
  );

  const openDetail = (order: Order) => {
    setDetailOrder(order);
    setDetailOpen(true);
  };

  const closeDetail = () => {
    setDetailOpen(false);
    setDetailOrder(null);
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
    orders,
    isLoading,
    error,
    paginatedOrders,
    totalOrders,
    page,
    pageSize,
    setPage,
    onPageSizeChange: handlePageSizeChange,
    detailOrder,
    detailOpen,
    openDetail,
    closeDetail,
  };
}
