import { useMemo } from "react";
import type { AxisOptions } from "react-charts";
import { formatBRL } from "@/lib/utils";
import type { DashboardData } from "@/types/dashboard";

const ORDER_STATUS_LABELS: Record<string, string> = {
  pendente: "Pendente",
  processando: "Processando",
  entregue: "Entregue",
  cancelado: "Cancelado",
};

const COMMISSION_STATUS_LABELS: Record<string, string> = {
  pendente: "Pendente",
  paga: "Paga",
};

const CHART_COLOR = "#1cb454";

type OrderDatum = { status: string; count: number; label: string };
type CommissionDatum = { status: string; count: number; label: string };
type ProductDatum = { productName: string; count: number; label: string };
type SellerDatum = { userName: string; amount: number; label: string };


export function useDashboardCharts(data: DashboardData | null | undefined) {
  const ordersChartData = useMemo(() => {
    if (!data?.ordersByStatus?.length) return [];
    return [
      {
        label: "Pedidos por status",
        data: data.ordersByStatus.map((item) => ({
          status: ORDER_STATUS_LABELS[item.status] ?? item.status,
          count: item.count,
          label: ORDER_STATUS_LABELS[item.status] ?? item.status,
        })),
      },
    ];
  }, [data]);

  const commissionsChartData = useMemo(() => {
    if (!data?.commissionsByStatus?.length) return [];
    return [
      {
        label: "Comissões por status",
        data: data.commissionsByStatus.map((item) => ({
          status: COMMISSION_STATUS_LABELS[item.status] ?? item.status,
          count: item.count,
          label: COMMISSION_STATUS_LABELS[item.status] ?? item.status,
        })),
      },
    ];
  }, [data]);

  const productsChartData = useMemo(() => {
    if (!data?.topProductsByOrders?.length) return [];
    return [
      {
        label: "Produtos com mais pedidos",
        data: data.topProductsByOrders.map((item) => ({
          productName: item.productName,
          count: item.count,
          label: item.productName,
        })),
      },
    ];
  }, [data]);

  const bestSellersChartData = useMemo(() => {
    if (!data?.bestSellersCurrentMonth?.length) return [];
    return [
      {
        label: "Melhores vendedores do mês",
        data: data.bestSellersCurrentMonth.map((item) => ({
          userName: item.userName,
          amount: item.amount,
          label: item.userName,
        })),
      },
    ];
  }, [data]);

  const ordersPrimaryAxis = useMemo<AxisOptions<OrderDatum>>(
    () => ({
      getValue: (d) => d.label,
      scaleType: "band",
      position: "bottom",
      showGrid: false,
    }),
    [],
  );

  const ordersSecondaryAxes = useMemo<AxisOptions<OrderDatum>[]>(
    () => [
      {
        getValue: (d) => d.count,
        scaleType: "linear",
        position: "left",
        elementType: "bar",
        showGrid: true,
      },
    ],
    [],
  );

  const ordersChartOptions = useMemo(
    () => ({
      data: ordersChartData,
      primaryAxis: ordersPrimaryAxis,
      secondaryAxes: ordersSecondaryAxes,
      defaultColors: [CHART_COLOR],
    }),
    [ordersChartData, ordersPrimaryAxis, ordersSecondaryAxes],
  );

  const commissionsPrimaryAxis = useMemo<AxisOptions<CommissionDatum>>(
    () => ({
      getValue: (d) => d.label,
      scaleType: "band",
      position: "bottom",
      showGrid: false,
    }),
    [],
  );

  const commissionsSecondaryAxes = useMemo<AxisOptions<CommissionDatum>[]>(
    () => [
      {
        getValue: (d) => d.count,
        scaleType: "linear",
        position: "left",
        elementType: "bar",
        showGrid: true,
        min: 0,
      },
    ],
    [],
  );

  const commissionsChartOptions = useMemo(
    () => ({
      data: commissionsChartData,
      primaryAxis: commissionsPrimaryAxis,
      secondaryAxes: commissionsSecondaryAxes,
      defaultColors: [CHART_COLOR],
      getSeriesStyle: () => ({ rectangle: { fill: CHART_COLOR } }),
      getDatumStyle: () => ({ rectangle: { fill: CHART_COLOR } }),
    }),
    [
      commissionsChartData,
      commissionsPrimaryAxis,
      commissionsSecondaryAxes,
    ],
  );

  const productsPrimaryAxis = useMemo<AxisOptions<ProductDatum>>(
    () => ({
      getValue: (d) => d.label,
      scaleType: "band",
      position: "bottom",
      showGrid: false,
    }),
    [],
  );

  const productsSecondaryAxes = useMemo<AxisOptions<ProductDatum>[]>(
    () => [
      {
        getValue: (d) => d.count,
        scaleType: "linear",
        position: "left",
        elementType: "bar",
        showGrid: true,
        min: 0,
      },
    ],
    [],
  );

  const productsChartOptions = useMemo(
    () => ({
      data: productsChartData,
      primaryAxis: productsPrimaryAxis,
      secondaryAxes: productsSecondaryAxes,
      defaultColors: [CHART_COLOR],
      getSeriesStyle: () => ({ rectangle: { fill: CHART_COLOR } }),
      getDatumStyle: () => ({ rectangle: { fill: CHART_COLOR } }),
    }),
    [productsChartData, productsPrimaryAxis, productsSecondaryAxes],
  );

  const bestSellersPrimaryAxis = useMemo<AxisOptions<SellerDatum>>(
    () => ({
      getValue: (d) => d.label,
      scaleType: "band",
      position: "bottom",
      showGrid: false,
    }),
    [],
  );

  const bestSellersSecondaryAxes = useMemo<AxisOptions<SellerDatum>[]>(
    () => [
      {
        getValue: (d: SellerDatum) => d.amount,
        scaleType: "linear" as const,
        position: "left" as const,
        elementType: "bar" as const,
        showGrid: true,
        min: 0,
        formatters: {
          scale: (value: number) => formatBRL(value),
          tooltip: (value: number) => formatBRL(value),
          cursor: (value: number) => formatBRL(value),
        },
      },
    ],
    [],
  );

  const bestSellersChartOptions = useMemo(
    () => ({
      data: bestSellersChartData,
      primaryAxis: bestSellersPrimaryAxis,
      secondaryAxes: bestSellersSecondaryAxes,
      defaultColors: [CHART_COLOR],
      getSeriesStyle: () => ({ rectangle: { fill: CHART_COLOR } }),
      getDatumStyle: () => ({ rectangle: { fill: CHART_COLOR } }),
    }),
    [
      bestSellersChartData,
      bestSellersPrimaryAxis,
      bestSellersSecondaryAxes,
    ],
  );

  return {
    ordersChartOptions,
    commissionsChartOptions,
    productsChartOptions,
    bestSellersChartOptions,
  };
}
