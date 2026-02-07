import { describe, it, expect } from "vitest";
import { commissionsService } from "../commissions.service";

const mockCommissions = [
  { id: "1", userId: "1", orderId: "1", amount: 30, status: "paga" },
  { id: "2", userId: "2", orderId: "2", amount: 20, status: "pendente" },
  { id: "3", userId: "1", orderId: "3", amount: 15, status: "paga" },
];

function createSchema() {
  const commissions = mockCommissions.map((c) => ({ ...c }));
  return {
    all: () => commissions,
    find: (_model: string, id: string) => {
      const idx = commissions.findIndex((x) => x.id === id);
      if (idx < 0) return undefined;
      const ref = {
        ...commissions[idx],
        update(attrs: Record<string, unknown>) {
          Object.assign(ref, attrs);
        },
      };
      return ref;
    },
  };
}

describe("commissionsService", () => {
  describe("list", () => {
    it("retorna todas as comissões sem filtros", () => {
      const schema = createSchema();
      const result = commissionsService.list(schema, { queryParams: {} });
      expect(result).toHaveLength(3);
    });

    it("filtra por status", () => {
      const schema = createSchema();
      const result = commissionsService.list(schema, {
        queryParams: { status: "paga" },
      });
      expect(result).toHaveLength(2);
      expect(result.every((c: { status: string }) => c.status === "paga")).toBe(
        true,
      );
    });

    it("filtra por userId", () => {
      const schema = createSchema();
      const result = commissionsService.list(schema, {
        queryParams: { userId: "1" },
      });
      expect(result).toHaveLength(2);
      expect(result.every((c: { userId: string }) => c.userId === "1")).toBe(
        true,
      );
    });

    it("filtra por orderId", () => {
      const schema = createSchema();
      const result = commissionsService.list(schema, {
        queryParams: { orderId: "2" },
      });
      expect(result).toHaveLength(1);
      expect(result[0].orderId).toBe("2");
    });
  });

  describe("getById", () => {
    it("retorna comissão quando existe", () => {
      const schema = createSchema();
      const result = commissionsService.getById(schema, "1");
      expect(result).toBeDefined();
      expect(result.amount).toBe(30);
    });

    it("retorna 404 quando não existe", () => {
      const schema = createSchema();
      const result = commissionsService.getById(schema, "99") as {
        code?: number;
      };
      expect(result.code).toBe(404);
    });
  });

  describe("update", () => {
    it("atualiza campos permitidos", () => {
      const schema = createSchema();
      const updated = commissionsService.update(
        schema,
        "1",
        JSON.stringify({ status: "pendente", amount: 25 }),
      );
      expect(updated.status).toBe("pendente");
      expect(updated.amount).toBe(25);
    });

    it("retorna 404 quando comissão não existe", () => {
      const schema = createSchema();
      const result = commissionsService.update(schema, "99", "{}") as {
        code?: number;
      };
      expect(result.code).toBe(404);
    });
  });
});
