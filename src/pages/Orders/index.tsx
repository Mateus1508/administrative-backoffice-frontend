import { Filter, Loader2, Eye } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { badgeVariants } from "@/components/ui/badge-variants";
import { DatePicker } from "@/components/ui/date-picker";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Pagination } from "@/components/ui/pagination";
import { cn, formatDate, formatBRL } from "@/lib/utils";
import { useOrdersPage, ORDER_STATUS_LABELS } from "@/hooks/useOrdersPage";
import { OrderDetailModal } from "./OrderDetailModal";
import type { OrderStatus } from "@/types/order";

export function Orders() {
  const {
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
    onPageSizeChange,
    detailOrder,
    detailOpen,
    openDetail,
    closeDetail,
  } = useOrdersPage();

  return (
    <div className="p-6">
      <header className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Pedidos</h1>
          <p className="mt-1 text-sm text-gray-500">Gerencie os pedidos</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setFilterOpen((o) => !o)}
            className={cn(
              "inline-flex items-center gap-2 rounded-lg border px-3 py-2 text-sm font-medium transition-colors",
              filterOpen || hasActiveFilters
                ? "border-[#1cb454] bg-[#1cb454]/10 text-[#1cb454]"
                : "border-gray-300 bg-white text-gray-700 hover:bg-gray-50",
            )}
          >
            <Filter className="h-4 w-4" aria-hidden />
            Filtros
            {hasActiveFilters && (
              <span className="ml-1 rounded-full bg-[#1cb454] px-1.5 py-0.5 text-xs text-white">
                ativo
              </span>
            )}
          </button>
        </div>
      </header>

      {filterOpen && (
        <div className="mb-6 rounded-lg border border-gray-200 bg-gray-50/80 p-4">
          <p className="mb-3 text-sm font-medium text-gray-700">Filtrar por</p>
          <div className="flex flex-wrap items-end gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="filter-status" className="text-xs">
                Status
              </Label>
              <Select
                value={filters.status || "_all"}
                onValueChange={(v: string) =>
                  setFilterAndResetPage(
                    "status",
                    v === "_all" ? "" : (v as OrderStatus),
                  )
                }
              >
                <SelectTrigger id="filter-status">
                  <SelectValue placeholder="Todos" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="_all">Todos</SelectItem>
                  <SelectItem value="pendente">Pendente</SelectItem>
                  <SelectItem value="processando">Processando</SelectItem>
                  <SelectItem value="entregue">Entregue</SelectItem>
                  <SelectItem value="cancelado">Cancelado</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="filter-dateFrom" className="text-xs">
                Data inicial
              </Label>
              <DatePicker
                id="filter-dateFrom"
                value={filters.dateFrom}
                onChange={(v) => setFilterAndResetPage("dateFrom", v)}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="filter-dateTo" className="text-xs">
                Data final
              </Label>
              <DatePicker
                id="filter-dateTo"
                value={filters.dateTo}
                onChange={(v) => setFilterAndResetPage("dateTo", v)}
              />
            </div>
            {hasActiveFilters && (
              <button
                type="button"
                onClick={clearFiltersAndResetPage}
                className="rounded-md px-3 py-2 text-sm text-gray-600 hover:bg-gray-200"
              >
                Limpar filtros
              </button>
            )}
          </div>
        </div>
      )}

      <div className="rounded-lg border border-gray-200 bg-white shadow-sm">
        {isLoading ? (
          <div className="flex items-center justify-center py-16">
            <Loader2
              className="h-8 w-8 animate-spin text-[#1cb454]"
              aria-hidden
            />
          </div>
        ) : error ? (
          <div className="py-16 text-center text-sm text-red-600">
            {error.message}
          </div>
        ) : orders.length === 0 ? (
          <div className="py-16 text-center text-sm text-gray-500">
            Nenhum pedido encontrado.
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[480px] text-left text-sm">
                <thead>
                  <tr className="border-b border-gray-200 bg-gray-50/80">
                    <th className="px-4 py-3 font-semibold text-gray-700">
                      Código
                    </th>
                    <th className="px-4 py-3 font-semibold text-gray-700">
                      Usuário
                    </th>
                    <th className="px-4 py-3 font-semibold text-gray-700">
                      Status
                    </th>
                    <th className="px-4 py-3 font-semibold text-gray-700">
                      Valor
                    </th>
                    <th className="px-4 py-3 font-semibold text-gray-700">
                      Data
                    </th>
                    <th className="w-12 px-4 py-3 text-right font-semibold text-gray-700">
                      <span className="sr-only">Ver detalhes</span>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedOrders.map((order) => (
                    <tr
                      key={order.id}
                      className="border-b border-gray-100 transition-colors hover:bg-gray-50/50"
                    >
                      <td className="px-4 py-3 font-medium text-gray-900 font-mono">
                        {order.orderId}
                      </td>
                      <td className="px-4 py-3 text-gray-600">
                        {order.user?.name ?? order.userId}
                      </td>
                      <td className="px-4 py-3">
                        <Badge
                          variant={order.status as keyof typeof badgeVariants}
                        >
                          {ORDER_STATUS_LABELS[order.status]}
                        </Badge>
                      </td>
                      <td className="px-4 py-3 text-gray-700">
                        {formatBRL(order.amount)}
                      </td>
                      <td className="px-4 py-3 text-gray-600">
                        {formatDate(order.date)}
                      </td>
                      <td className="px-4 py-3 text-right">
                        <button
                          type="button"
                          onClick={() => openDetail(order)}
                          className="inline-flex rounded-md p-2 text-gray-500 hover:bg-gray-100 hover:text-[#1cb454]"
                          aria-label={`Ver detalhes do pedido ${order.orderId}`}
                        >
                          <Eye className="h-4 w-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <Pagination
              page={page}
              pageSize={pageSize}
              totalItems={totalOrders}
              onPageChange={setPage}
              onPageSizeChange={onPageSizeChange}
            />
          </>
        )}
      </div>

      <OrderDetailModal
        order={detailOrder}
        open={detailOpen}
        onClose={closeDetail}
      />
    </div>
  );
}
