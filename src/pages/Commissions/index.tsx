import { Filter, Loader2, Wallet, Clock, CheckCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { badgeVariants } from "@/components/ui/badge-variants";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Pagination } from "@/components/ui/pagination";
import { cn, formatBRL } from "@/lib/utils";
import {
  useCommissionsPage,
  COMMISSION_STATUS_LABELS,
} from "@/hooks/useCommissionsPage";
import type { CommissionStatus } from "@/types/commission";

export function Commissions() {
  const {
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
    onPageSizeChange,
    totalsByStatus,
  } = useCommissionsPage();

  return (
    <div className="p-6">
      <header className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Comissões</h1>
          <p className="mt-1 text-sm text-gray-500">
            Gerencie as comissões dos parceiros
          </p>
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

      <div className="mb-6 grid gap-4 sm:grid-cols-3">
        <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
          <div className="flex items-center gap-2 text-gray-500">
            <Clock className="h-5 w-5" />
            <span className="text-sm font-medium">Pendentes</span>
          </div>
          <p className="mt-2 text-2xl font-bold text-gray-900">
            {formatBRL(totalsByStatus.pendente.amount)}
          </p>
          <p className="mt-0.5 text-xs text-gray-500">
            {totalsByStatus.pendente.count} comissão(ões)
          </p>
        </div>
        <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
          <div className="flex items-center gap-2 text-[#1cb454]">
            <CheckCircle className="h-5 w-5" />
            <span className="text-sm font-medium">Pagas</span>
          </div>
          <p className="mt-2 text-2xl font-bold text-gray-900">
            {formatBRL(totalsByStatus.paga.amount)}
          </p>
          <p className="mt-0.5 text-xs text-gray-500">
            {totalsByStatus.paga.count} comissão(ões)
          </p>
        </div>
        <div className="rounded-lg border border-[#1cb454]/30 bg-[#1cb454]/5 p-4 shadow-sm">
          <div className="flex items-center gap-2 text-[#1cb454]">
            <Wallet className="h-5 w-5" />
            <span className="text-sm font-medium">Total geral</span>
          </div>
          <p className="mt-2 text-2xl font-bold text-gray-900">
            {formatBRL(totalsByStatus.total.amount)}
          </p>
          <p className="mt-0.5 text-xs text-gray-500">
            {totalsByStatus.total.count} comissão(ões)
          </p>
        </div>
      </div>

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
                    v === "_all" ? "" : (v as CommissionStatus),
                  )
                }
              >
                <SelectTrigger id="filter-status">
                  <SelectValue placeholder="Todos" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="_all">Todos</SelectItem>
                  <SelectItem value="pendente">Pendente</SelectItem>
                  <SelectItem value="paga">Paga</SelectItem>
                </SelectContent>
              </Select>
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
        ) : commissions.length === 0 ? (
          <div className="py-16 text-center text-sm text-gray-500">
            Nenhuma comissão encontrada.
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[480px] text-left text-sm">
                <thead>
                  <tr className="border-b border-gray-200 bg-gray-50/80">
                    <th className="px-4 py-3 font-semibold text-gray-700">
                      Parceiro
                    </th>
                    <th className="px-4 py-3 font-semibold text-gray-700">
                      Pedido
                    </th>
                    <th className="px-4 py-3 font-semibold text-gray-700">
                      Valor
                    </th>
                    <th className="px-4 py-3 font-semibold text-gray-700">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedCommissions.map((commission) => (
                    <tr
                      key={commission.id}
                      className="border-b border-gray-100 transition-colors hover:bg-gray-50/50"
                    >
                      <td className="px-4 py-3 font-medium text-gray-900">
                        {commission.user?.name ?? `ID ${commission.userId}`}
                      </td>
                      <td className="px-4 py-3 font-mono text-gray-600">
                        {commission.order?.orderId ?? commission.orderId}
                      </td>
                      <td className="px-4 py-3 text-gray-700">
                        {formatBRL(commission.amount)}
                      </td>
                      <td className="px-4 py-3">
                        <Badge
                          variant={
                            commission.status as keyof typeof badgeVariants
                          }
                        >
                          {COMMISSION_STATUS_LABELS[commission.status]}
                        </Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <Pagination
              page={page}
              pageSize={pageSize}
              totalItems={totalCommissions}
              onPageChange={setPage}
              onPageSizeChange={onPageSizeChange}
            />
          </>
        )}
      </div>
    </div>
  );
}
