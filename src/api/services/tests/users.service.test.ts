import { describe, it, expect } from "vitest";
import { usersService } from "../users.service";

const mockUsers = [
  {
    id: "1",
    name: "Maria",
    email: "maria@email.com",
    type: "PARTNER",
    status: "ativo",
  },
  {
    id: "2",
    name: "João Silva",
    email: "joao@email.com",
    type: "CUSTOMER",
    status: "inativo",
  },
  {
    id: "3",
    name: "Ana Costa",
    email: "ana@email.com",
    type: "CUSTOMER",
    status: "ativo",
  },
];

function createSchema() {
  const users = mockUsers.map((u) => ({ ...u }));
  return {
    all: (_model: string) => users,
    find: (_model: string, id: string) => {
      const i = users.findIndex((x) => x.id === id);
      if (i < 0) return undefined;
      const ref = { ...users[i] } as Record<string, unknown> & { update: (attrs: Record<string, unknown>) => void };
      ref.update = (attrs: Record<string, unknown>) => {
        Object.assign(ref, attrs);
      };
      return ref;
    },
  };
}

describe("usersService", () => {
  describe("list", () => {
    it("retorna todos os usuários sem filtros", () => {
      const schema = createSchema();
      const result = usersService.list(schema, { queryParams: {} });
      expect(result).toHaveLength(3);
    });

    it("filtra por status", () => {
      const schema = createSchema();
      const result = usersService.list(schema, {
        queryParams: { status: "ativo" },
      });
      expect(result).toHaveLength(2);
      expect(result.every((u: { status: string }) => u.status === "ativo")).toBe(true);
    });

    it("filtra por type", () => {
      const schema = createSchema();
      const result = usersService.list(schema, {
        queryParams: { type: "CUSTOMER" },
      });
      expect(result).toHaveLength(2);
      expect(result.every((u: { type: string }) => u.type === "CUSTOMER")).toBe(true);
    });

    it("filtra por search no nome e email", () => {
      const schema = createSchema();
      const result = usersService.list(schema, {
        queryParams: { search: "João" },
      });
      expect(result).toHaveLength(1);
      expect(result[0].name).toBe("João Silva");
    });
  });

  describe("getById", () => {
    it("retorna usuário quando existe", () => {
      const schema = createSchema();
      const result = usersService.getById(schema, "1");
      expect(result).toBeDefined();
      expect(result.name).toBe("Maria");
    });

    it("retorna Response 404 quando não existe", () => {
      const schema = createSchema();
      const result = usersService.getById(schema, "99") as { code?: number };
      expect(result).toBeDefined();
      expect(result.code).toBe(404);
    });
  });

  describe("update", () => {
    it("atualiza apenas campos permitidos", () => {
      const schema = createSchema();
      const updated = usersService.update(schema, "1", JSON.stringify({ name: "Maria Updated", email: "m@m.com" }));
      expect(updated.name).toBe("Maria Updated");
      expect(updated.email).toBe("m@m.com");
    });

    it("retorna 404 quando usuário não existe", () => {
      const schema = createSchema();
      const result = usersService.update(schema, "99", "{}") as { code?: number };
      expect(result.code).toBe(404);
    });
  });
});
