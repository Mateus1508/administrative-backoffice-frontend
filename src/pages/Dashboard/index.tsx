import { useMemo } from "react";
import { Chart } from "react-charts";
import { Loader2 } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useDashboard } from "@/hooks/useDashboard";
import { formatBRL } from "@/lib/utils";
import type { AxisOptions } from "react-charts";

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

type OrderDatum = { status: string; count: number; label: string };
type CommissionDatum = { status: string; count: number; label: string };
type ProductDatum = { productName: string; count: number; label: string };
type SellerDatum = { userName: string; amount: number; label: string };

export function Dashboard() {
  const { data, isLoading, error } = useDashboard();

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
  }, [data?.ordersByStatus]);

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
  }, [data?.commissionsByStatus]);

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
  }, [data?.topProductsByOrders]);

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
  }, [data?.bestSellersCurrentMonth]);

  const ordersPrimaryAxis = useMemo<
    AxisOptions<OrderDatum>
  >(
    () => ({
      getValue: (datum) => datum.label,
      scaleType: "band",
      position: "bottom",
      showGrid: false,
    }),
    [],
  );

  const ordersSecondaryAxes = useMemo<AxisOptions<OrderDatum>[]>(
    () => [
      {
        getValue: (datum) => datum.count,
        scaleType: "linear",
        position: "left",
        elementType: "bar",
        showGrid: true,
      },
    ],
    [],
  );

  const commissionsPrimaryAxis = useMemo<
    AxisOptions<CommissionDatum>
  >(
    () => ({
      getValue: (datum) => datum.label,
      scaleType: "band",
      position: "bottom",
      showGrid: false,
    }),
    [],
  );

  const commissionsSecondaryAxes = useMemo<AxisOptions<CommissionDatum>[]>(
    () => [
      {
        getValue: (datum) => datum.count,
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
      defaultColors: ["#1cb454"],
      getSeriesStyle: () => ({
        rectangle: { fill: "#1cb454" },
      }),
      getDatumStyle: () => ({
        rectangle: { fill: "#1cb454" },
      }),
    }),
    [
      commissionsChartData,
      commissionsPrimaryAxis,
      commissionsSecondaryAxes,
    ],
  );

  const productsPrimaryAxis = useMemo<AxisOptions<ProductDatum>>(
    () => ({
      getValue: (datum) => datum.label,
      scaleType: "band",
      position: "bottom",
      showGrid: false,
    }),
    [],
  );

  const productsSecondaryAxes = useMemo<AxisOptions<ProductDatum>[]>(
    () => [
      {
        getValue: (datum) => datum.count,
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
      defaultColors: ["#1cb454"],
      getSeriesStyle: () => ({ rectangle: { fill: "#1cb454" } }),
      getDatumStyle: () => ({ rectangle: { fill: "#1cb454" } }),
    }),
    [productsChartData, productsPrimaryAxis, productsSecondaryAxes],
  );

  const bestSellersPrimaryAxis = useMemo<AxisOptions<SellerDatum>>(
    () => ({
      getValue: (datum) => datum.label,
      scaleType: "band",
      position: "bottom",
      showGrid: false,
    }),
    [],
  );

  const bestSellersSecondaryAxes = useMemo<AxisOptions<SellerDatum>[]>(
    () => [
      {
        getValue: (datum) => datum.amount,
        scaleType: "linear",
        position: "left",
        elementType: "bar",
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
      defaultColors: ["#1cb454"],
      getSeriesStyle: () => ({ rectangle: { fill: "#1cb454" } }),
      getDatumStyle: () => ({ rectangle: { fill: "#1cb454" } }),
    }),
    [
      bestSellersChartData,
      bestSellersPrimaryAxis,
      bestSellersSecondaryAxes,
    ],
  );

  if (isLoading) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center p-6">
        <Loader2
          className="h-10 w-10 animate-spin text-[#1cb454]"
          aria-hidden
        />
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="p-6">
        <p className="text-center text-red-600">
          {error?.message ?? "Falha ao carregar o dashboard."}
        </p>
      </div>
    );
  }

  const {
    stats,
    ordersByStatus,
    commissionsByStatus,
    topProductsByOrders,
    bestSellersCurrentMonth,
  } = data;

  const statsCards = [
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

  return (
    <div className="p-6">
      <header className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="mt-1 text-sm text-gray-500">
          Visão geral do backoffice administrativo
        </p>
      </header>

      <div className="mb-8 grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
        {statsCards.map((stat) => (
          <Card
            key={stat.title}
            className="border-[#1cb454]/20 bg-white shadow-md transition-shadow hover:shadow-lg"
          >
            <CardHeader className="pb-2">
              <CardDescription className="text-gray-600">
                {stat.title}
              </CardDescription>
              <CardTitle className="text-2xl font-bold text-[#1cb454]">
                {stat.value}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-500">{stat.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="border-gray-200 bg-white shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg">Pedidos por status</CardTitle>
            <CardDescription>Quantidade de pedidos em cada status</CardDescription>
          </CardHeader>
          <CardContent>
            {ordersByStatus.every((s) => s.count === 0) ? (
              <p className="flex h-[280px] items-center justify-center text-sm text-gray-500">
                Nenhum pedido para exibir
              </p>
            ) : (
              <>
                <div className="h-[280px] w-full">
                  <Chart
                    options={{
                      data: ordersChartData,
                      primaryAxis: ordersPrimaryAxis,
                      secondaryAxes: ordersSecondaryAxes,
                      defaultColors: ["#1cb454"],
                    }}
                  />
                </div>
                <p className="mt-3 border-t border-gray-100 pt-3 text-xs text-gray-500">
                  <span className="font-medium text-gray-600">Eixo horizontal (colunas):</span> status do pedido.{" "}
                  <span className="font-medium text-gray-600">Eixo vertical (valores):</span> quantidade de pedidos.
                </p>
              </>
            )}
          </CardContent>
        </Card>

        <Card className="border-gray-200 bg-white shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg">Comissões por status</CardTitle>
            <CardDescription>
              Quantidade de comissões pendentes e pagas
            </CardDescription>
          </CardHeader>
          <CardContent>
            {commissionsByStatus.every((s) => s.count === 0) ? (
              <p className="flex h-[280px] items-center justify-center text-sm text-gray-500">
                Nenhuma comissão para exibir
              </p>
            ) : (
              <>
                <div className="h-[280px] w-full">
                  <Chart options={commissionsChartOptions} />
                </div>
                <p className="mt-3 border-t border-gray-100 pt-3 text-xs text-gray-500">
                  <span className="font-medium text-gray-600">Eixo horizontal (colunas):</span> status da comissão (pendente ou paga).{" "}
                  <span className="font-medium text-gray-600">Eixo vertical (valores):</span> quantidade de comissões.
                </p>
              </>
            )}
          </CardContent>
        </Card>

        <Card className="border-gray-200 bg-white shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg">Produtos com mais pedidos</CardTitle>
            <CardDescription>
              Quantidade de pedidos por produto
            </CardDescription>
          </CardHeader>
          <CardContent>
            {!topProductsByOrders?.length ? (
              <p className="flex h-[280px] items-center justify-center text-sm text-gray-500">
                Nenhum dado para exibir
              </p>
            ) : (
              <>
                <div className="h-[280px] w-full">
                  <Chart options={productsChartOptions} />
                </div>
                <p className="mt-3 border-t border-gray-100 pt-3 text-xs text-gray-500">
                  <span className="font-medium text-gray-600">Eixo horizontal (colunas):</span> nome do produto.{" "}
                  <span className="font-medium text-gray-600">Eixo vertical (valores):</span> quantidade de pedidos.
                </p>
              </>
            )}
          </CardContent>
        </Card>

        <Card className="border-gray-200 bg-white shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg">
              Melhores vendedores do mês atual
            </CardTitle>
            <CardDescription>
              Parceiros com maior valor em comissões no último mês com dados
            </CardDescription>
          </CardHeader>
          <CardContent>
            {!bestSellersCurrentMonth?.length ? (
              <p className="flex h-[280px] items-center justify-center text-sm text-gray-500">
                Nenhuma comissão no mês atual
              </p>
            ) : (
              <>
                <div className="h-[280px] w-full">
                  <Chart options={bestSellersChartOptions} />
                </div>
                <p className="mt-3 border-t border-gray-100 pt-3 text-xs text-gray-500">
                  <span className="font-medium text-gray-600">Eixo horizontal (colunas):</span> nome do parceiro (vendedor).{" "}
                  <span className="font-medium text-gray-600">Eixo vertical (valores):</span> valor total em comissões (R$).
                </p>
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
