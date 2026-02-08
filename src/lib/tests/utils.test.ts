import { describe, it, expect } from "vitest";
import { formatDate, formatBRL, parseBRL, cn } from "@/lib/utils";

describe("formatDate", () => {
  it("formata data ISO para dd/MM/yyyy", () => {
    expect(formatDate("2025-02-15")).toBe("15/02/2025");
    expect(formatDate("2025-01-01")).toBe("01/01/2025");
  });

  it("retorna string vazia para entrada vazia", () => {
    expect(formatDate("")).toBe("");
  });
});

describe("formatBRL", () => {
  it("formata número como moeda em Real", () => {
    expect(formatBRL(100)).toMatch(/R\$\s*100,00/);
    expect(formatBRL(1234.56)).toMatch(/R\$\s*1\.234,56/);
    expect(formatBRL(0)).toMatch(/R\$\s*0,00/);
  });
});

describe("parseBRL", () => {
  it("converte string BRL para número", () => {
    expect(parseBRL("1.234,56")).toBe(1234.56);
    expect(parseBRL("100,00")).toBe(100);
    expect(parseBRL("R$ 350,00")).toBe(350);
  });

  it("retorna 0 para string vazia ou só espaços", () => {
    expect(parseBRL("")).toBe(0);
    expect(parseBRL("   ")).toBe(0);
  });

  it("retorna 0 para valor inválido", () => {
    expect(parseBRL("abc")).toBe(0);
  });
});

describe("cn", () => {
  it("combina classes com tailwind-merge", () => {
    expect(cn("px-2", "px-4")).toBe("px-4");
    expect(cn("text-red-500", "text-blue-500")).toBe("text-blue-500");
  });

  it("aceita condicionais", () => {
    const showActive = true;
    const hideActive = false;
    expect(cn("base", showActive ? "active" : null)).toBe("base active");
    expect(cn("base", hideActive ? "active" : null)).toBe("base");
  });
});
