import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(isoDate: string): string {
  if (!isoDate) return "";
  const [y, m, d] = isoDate.split("-");
  return `${d}/${m}/${y}`;
}

export function formatBRL(value: number): string {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value);
}

export function parseBRL(value: string): number {
  if (!value || !value.trim()) return 0;
  const normalized = value.replace(/\s/g, "").replace(/R\$/gi, "").trim();
  const hasComma = normalized.includes(",");
  const parts = normalized.split(",");
  const integerPart = (hasComma ? parts[0] : normalized).replace(/\./g, "");
  const decimalPart = hasComma && parts[1] ? parts[1].replace(/\D/g, "").slice(0, 2) : "";
  const numStr = decimalPart ? `${integerPart}.${decimalPart}` : integerPart;
  const parsed = Number.parseFloat(numStr);
  return Number.isNaN(parsed) ? 0 : parsed;
}
