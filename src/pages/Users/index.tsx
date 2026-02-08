import { Filter, Loader2, Eye } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Pagination } from "@/components/ui/pagination";
import { cn } from "@/lib/utils";
import { useUsersPage } from "@/hooks/useUsersPage";
import { UserDetailModal } from "./UserDetailModal";
import type { UserStatus, UserType } from "@/types/user";

export function Users() {
  const {
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
    onPageSizeChange,
    detailUser,
    detailOpen,
    openDetail,
    closeDetail,
  } = useUsersPage();

  return (
    <div className="p-6">
      <header className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Usuários</h1>
          <p className="mt-1 text-sm text-gray-500">
            Gerencie os usuários do sistema
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

      {filterOpen && (
        <div className="mb-6 rounded-lg border border-gray-200 bg-gray-50/80 p-4">
          <p className="mb-3 text-sm font-medium text-gray-700">Filtrar por</p>
          <div className="flex flex-wrap items-end gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="filter-search" className="text-xs">
                Nome ou e-mail
              </Label>
              <Input
                id="filter-search"
                type="text"
                placeholder="Buscar..."
                value={filters.search}
                onChange={(e) => setFilterAndResetPage("search", e.target.value)}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="filter-status" className="text-xs">
                Status
              </Label>
              <Select
                value={filters.status || "_all"}
                onValueChange={(v: string) =>
                  setFilterAndResetPage(
                    "status",
                    v === "_all" ? "" : (v as UserStatus),
                  )
                }
              >
                <SelectTrigger id="filter-status">
                  <SelectValue placeholder="Todos" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="_all">Todos</SelectItem>
                  <SelectItem value="ativo">Ativo</SelectItem>
                  <SelectItem value="inativo">Inativo</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="filter-type" className="text-xs">
                Tipo
              </Label>
              <Select
                value={filters.type || "_all"}
                onValueChange={(v: string) =>
                  setFilterAndResetPage(
                    "type",
                    v === "_all" ? "" : (v as UserType),
                  )
                }
              >
                <SelectTrigger id="filter-type">
                  <SelectValue placeholder="Todos" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="_all">Todos</SelectItem>
                  <SelectItem value="PARTNER">Parceiro</SelectItem>
                  <SelectItem value="CUSTOMER">Cliente</SelectItem>
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
        ) : users.length === 0 ? (
          <div className="py-16 text-center text-sm text-gray-500">
            Nenhum usuário encontrado.
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[480px] text-left text-sm">
                <thead>
                  <tr className="border-b border-gray-200 bg-gray-50/80">
                    <th className="px-4 py-3 font-semibold text-gray-700">
                      Nome
                    </th>
                    <th className="px-4 py-3 font-semibold text-gray-700">
                      E-mail
                    </th>
                    <th className="px-4 py-3 font-semibold text-gray-700">
                      Tipo
                    </th>
                    <th className="w-12 px-4 py-3 text-right font-semibold text-gray-700">
                      <span className="sr-only">Ver detalhes</span>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedUsers.map((user) => (
                    <tr
                      key={user.id}
                      className="border-b border-gray-100 transition-colors hover:bg-gray-50/50"
                    >
                      <td className="px-4 py-3 font-medium text-gray-900">
                        {user.name}
                      </td>
                      <td className="px-4 py-3 text-gray-600">{user.email}</td>
                      <td className="px-4 py-3">
                        <Badge variant={user.type}>{user.type}</Badge>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <button
                          type="button"
                          onClick={() => openDetail(user)}
                          className="inline-flex rounded-md p-2 text-gray-500 hover:bg-gray-100 hover:text-[#1cb454]"
                          aria-label={`Ver detalhes de ${user.name}`}
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
              totalItems={totalUsers}
              onPageChange={setPage}
              onPageSizeChange={onPageSizeChange}
            />
          </>
        )}
      </div>

      <UserDetailModal
        user={detailUser}
        open={detailOpen}
        onClose={closeDetail}
      />
    </div>
  );
}
