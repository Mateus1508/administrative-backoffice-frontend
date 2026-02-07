import { describe, it, expect } from "vitest";
import { ordersService } from "../orders.service";

interface MockOrder {
  id: string;
  orderId: string;
  userId: string;
  status: string;
  amount: number;
  date: string;
}

interface MockOrderWithUpdate extends MockOrder {
  update(attrs: Record<string, unknown>): void;
}

const mockOrders: MockOrder[] = [
  {
    id: "1",
    orderId: "AAA111",
    userId: "1",
    status: "entregue",
    amount: 100,
    date: "2025-02-01",
  },
  {
    id: "2",
    orderId: "BBB222",
    userId: "2",
    status: "pendente",
    amount: 200,
    date: "2025-02-15",
  },
  {
    id: "3",
    orderId: "CCC333",
    userId: "1",
    status: "entregue",
    amount: 150,
    date: "2025-01-10",
  },
];

function createSchema() {
  const orders = mockOrders.map((o) => ({ ...o }));
  return {
    all: (model: string): MockOrder[] => {
      void model;
      return orders;
    },
    find: (model: string, id: string): MockOrderWithUpdate | undefined => {
      void model;
      const idx = orders.findIndex((x) => x.id === id);
      if (idx < 0) return undefined;
      const ref: MockOrderWithUpdate = {
        ...orders[idx],
        update(attrs: Record<string, unknown>) {
          Object.assign(ref, attrs);
        },
      };
      return ref;
    },
  };
}

describe("ordersService", () => {
  describe("list", () => {
    it("retorna todos os pedidos sem filtros", () => {
      const schema = createSchema();
      const result = ordersService.list(schema, { queryParams: {} }) as MockOrder[];
      expect(result).toHaveLength(3);
    });

    it("filtra por status", () => {
      const schema = createSchema();
      const result = ordersService.list(schema, {
        queryParams: { status: "entregue" },
      }) as MockOrder[];
      expect(result).toHaveLength(2);
      expect(result.every((o) => o.status === "entregue")).toBe(true);
    });

    it("filtra por dateFrom", () => {
      const schema = createSchema();
      const result = ordersService.list(schema, {
        queryParams: { dateFrom: "2025-02-01" },
      }) as MockOrder[];
      expect(result).toHaveLength(2);
      expect(result.every((o) => o.date >= "2025-02-01")).toBe(true);
    });

    it("filtra por dateTo", () => {
      const schema = createSchema();
      const result = ordersService.list(schema, {
        queryParams: { dateTo: "2025-01-31" },
      }) as MockOrder[];
      expect(result).toHaveLength(1);
      expect(result[0].date).toBe("2025-01-10");
    });
  });

  describe("getById", () => {
    it("retorna pedido quando existe", () => {
      const schema = createSchema();
      const result = ordersService.getById(schema, "1") as MockOrderWithUpdate;
      expect(result).toBeDefined();
      expect(result.orderId).toBe("AAA111");
    });

    it("retorna 404 quando não existe", () => {
      const schema = createSchema();
      const result = ordersService.getById(schema, "99") as unknown as { code: number };
      expect(result.code).toBe(404);
    });
  });

  describe("update", () => {
    it("atualiza status e amount", () => {
      const schema = createSchema();
      const updated = ordersService.update(
        schema,
        "1",
        JSON.stringify({ status: "cancelado", amount: 50 }),
      ) as MockOrderWithUpdate;
      expect(updated.status).toBe("cancelado");
      expect(updated.amount).toBe(50);
    });

    it("retorna 404 quando pedido não existe", () => {
      const schema = createSchema();
      const result = ordersService.update(schema, "99", "{}") as unknown as { code: number };
      expect(result.code).toBe(404);
    });
  });
});
