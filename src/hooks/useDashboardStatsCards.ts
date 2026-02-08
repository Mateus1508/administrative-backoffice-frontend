import { useMemo } from "react";
import { formatBRL } from "@/lib/utils";
import type { DashboardStats } from "@/types/dashboard";

export interface StatsCardItem {
  title: string;
  value: string;
  description: string;
}

export function useDashboardStatsCards(
  stats: DashboardStats | null | undefined,
): StatsCardItem[] {
  return useMemo(() => {
    if (!stats) return [];
    return [
      {
        title: "Total de usuários",
        value: String(stats.totalUsers),
        description: "Usuários cadastrados no sistema",
      },
      {
        title: "Usuários ativos",
        value: String(stats.activeUsers),
        description: "Ativos no sistema",
      },
      {
        title: "Total de pedidos",
        value: String(stats.totalOrders),
        description: "Pedidos realizados",
      },
      {
        title: "Valor total dos pedidos",
        value: formatBRL(stats.totalOrdersAmount),
        description: "Soma de todos os pedidos",
      },
      {
        title: "Valor total de comissões",
        value: formatBRL(stats.totalCommissionsAmount),
        description: "Soma das comissões",
      },
    ];
  }, [stats]);
}
