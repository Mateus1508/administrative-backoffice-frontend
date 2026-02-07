import { describe, it, expect } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useFilters } from "@/hooks/useFilters";

describe("useFilters", () => {
  it("inicializa com filtros padrão", () => {
    const initial = { status: "", search: "" };
    const { result } = renderHook(() => useFilters(initial));
    expect(result.current.filters).toEqual(initial);
    expect(result.current.hasActiveFilters).toBe(false);
  });

  it("atualiza um filtro com setFilter", () => {
    const initial = { status: "", search: "" };
    const { result } = renderHook(() => useFilters(initial));
    act(() => {
      result.current.setFilter("status", "ativo");
    });
    expect(result.current.filters).toEqual({ status: "ativo", search: "" });
    expect(result.current.hasActiveFilters).toBe(true);
  });

  it("limpa filtros com clearFilters", () => {
    const initial = { status: "", search: "" };
    const { result } = renderHook(() => useFilters(initial));
    act(() => {
      result.current.setFilter("status", "ativo");
    });
    expect(result.current.hasActiveFilters).toBe(true);
    act(() => {
      result.current.clearFilters();
    });
    expect(result.current.filters).toEqual(initial);
    expect(result.current.hasActiveFilters).toBe(false);
  });

  it("hasActiveFilters considera diferença de trim em strings", () => {
    const initial = { search: "" };
    const { result } = renderHook(() => useFilters(initial));
    act(() => {
      result.current.setFilter("search", "  ");
    });
    expect(result.current.hasActiveFilters).toBe(false);
  });
});
