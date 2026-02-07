import { useState, useCallback, useMemo } from 'react'

function shallowDifferent<T extends object>(a: T, b: T): boolean {
  const keys = new Set([...Object.keys(a), ...Object.keys(b)]) as Set<keyof T>
  for (const key of keys) {
    const ak = a[key]
    const bk = b[key]
    if (typeof ak === 'string' && typeof bk === 'string') {
      if (ak.trim() !== bk.trim()) return true
    } else if (ak !== bk) {
      return true
    }
  }
  return false
}

export function useFilters<T extends object>(initialFilters: T) {
  const [filters, setFilters] = useState<T>(initialFilters)

  const setFilter = useCallback(<K extends keyof T>(key: K, value: T[K]) => {
    setFilters((prev) => ({ ...prev, [key]: value }))
  }, [])

  const clearFilters = useCallback(() => {
    setFilters(initialFilters)
  }, [initialFilters])

  const hasActiveFilters = useMemo(
    () => shallowDifferent(filters, initialFilters),
    [filters, initialFilters]
  )

  return {
    filters,
    setFilters,
    setFilter,
    clearFilters,
    hasActiveFilters,
  }
}
