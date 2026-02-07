import { useQuery } from "@tanstack/react-query";
import type { Order, OrderFilters } from "@/types/order";

async function fetchOrders(filters: OrderFilters): Promise<Order[]> {
  const params = new URLSearchParams();
  if (filters.status) params.set("status", filters.status);
  if (filters.dateFrom) params.set("dateFrom", filters.dateFrom);
  if (filters.dateTo) params.set("dateTo", filters.dateTo);
  const query = params.toString();
  const res = await fetch(`/api/orders${query ? `?${query}` : ""}`);
  if (!res.ok) throw new Error("Falha ao carregar pedidos");
  const data = await res.json();
  return data.orders ?? data ?? [];
}

export function useOrders(filters: OrderFilters) {
  return useQuery({
    queryKey: ["orders", filters],
    queryFn: () => fetchOrders(filters),
  });
}
