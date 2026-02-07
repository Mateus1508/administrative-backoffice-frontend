import { useQuery } from "@tanstack/react-query";
import type { Commission, CommissionFilters } from "@/types/commission";

async function fetchCommissions(filters: CommissionFilters): Promise<Commission[]> {
  const params = new URLSearchParams();
  if (filters.status) params.set("status", filters.status);
  const query = params.toString();
  const res = await fetch(`/api/commissions${query ? `?${query}` : ""}`);
  if (!res.ok) throw new Error("Falha ao carregar comissões");
  const data = await res.json();
  return data.commissions ?? data ?? [];
}

export function useCommissions(filters: CommissionFilters) {
  return useQuery({
    queryKey: ["commissions", filters],
    queryFn: () => fetchCommissions(filters),
  });
}
