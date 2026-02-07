import { useState, useEffect } from "react";

/**
 * Retorna um valor que só é atualizado após `delay` ms sem novas mudanças.
 * Útil para atrasar buscas enquanto o usuário digita.
 */
export function useDebouncedValue<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setDebouncedValue(value);
    }, delay);
    return () => window.clearTimeout(timer);
  }, [value, delay]);

  return debouncedValue;
}
