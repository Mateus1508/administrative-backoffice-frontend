import { describe, it, expect } from "vitest";
import { getDashboard } from "../dashboard.service";

const mockUsers = [
  { id: "1", name: "Parceiro A", status: "ativo" },
  { id: "2", name: "Parceiro B", status: "ativo" },
  { id: "3", name: "Cliente", status: "inativo" },
];

const mockOrders = [
  { id: "1", status: "entregue", amount: 100, date: "2025-02-10", productName: "Plano A" },
  { id: "2", status: "pendente", amount: 200, date: "2025-02-15", productName: "Plano B" },
  { id: "3", status: "entregue", amount: 150, date: "2025-02-10", productName: "Plano A" },
];

const mockCommissions = [
  { id: "1", userId: "1", orderId: "1", amount: 10, status: "paga" },
  { id: "2", userId: "2", orderId: "2", amount: 20, status: "pendente" },
  { id: "3", userId: "1", orderId: "3", amount: 15, status: "paga" },
];

function createSchema() {
  return {
    all: (model: string) => {
      if (model === "user") return { models: [...mockUsers] };
      if (model === "order") return { models: [...mockOrders] };
      if (model === "commission") return { models: [...mockCommissions] };
      return { models: [] };
    },
    find: (_model: string, id: string) => {
      const order = mockOrders.find((o) => o.id === id);
      return order ? { ...order, date: order.date, attrs: { date: order.date } } : undefined;
    },
  };
}

describe("getDashboard", () => {
  it("retorna stats com totais corretos", () => {
    const schema = createSchema();
    const result = getDashboard(schema);
    expect(result.stats.totalUsers).toBe(3);
    expect(result.stats.activeUsers).toBe(2);
    expect(result.stats.totalOrders).toBe(3);
    expect(result.stats.totalOrdersAmount).toBe(450);
    expect(result.stats.totalCommissionsAmount).toBe(45);
  });

  it("retorna ordersByStatus com todos os status", () => {
    const schema = createSchema();
    const result = getDashboard(schema);
    expect(result.ordersByStatus).toHaveLength(4);
    const pendente = result.ordersByStatus.find((s) => s.status === "pendente");
    const entregue = result.ordersByStatus.find((s) => s.status === "entregue");
    expect(pendente?.count).toBe(1);
    expect(entregue?.count).toBe(2);
  });

  it("retorna commissionsByStatus", () => {
    const schema = createSchema();
    const result = getDashboard(schema);
    expect(result.commissionsByStatus).toHaveLength(2);
    const paga = result.commissionsByStatus.find((s) => s.status === "paga");
    expect(paga?.count).toBe(2);
    expect(paga?.amount).toBe(25);
  });

  it("retorna topProductsByOrders ordenado por quantidade", () => {
    const schema = createSchema();
    const result = getDashboard(schema);
    expect(result.topProductsByOrders.length).toBeGreaterThan(0);
    expect(result.topProductsByOrders[0].productName).toBe("Plano A");
    expect(result.topProductsByOrders[0].count).toBe(2);
  });

  it("retorna bestSellersCurrentMonth com nomes dos usuários", () => {
    const schema = createSchema();
    const result = getDashboard(schema);
    expect(result.bestSellersCurrentMonth.length).toBeGreaterThan(0);
    expect(result.bestSellersCurrentMonth[0]).toHaveProperty("userName");
    expect(result.bestSellersCurrentMonth[0]).toHaveProperty("amount");
    expect(result.bestSellersCurrentMonth[0]).toHaveProperty("count");
  });
});
