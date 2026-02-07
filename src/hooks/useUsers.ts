import { useQuery } from '@tanstack/react-query'
import type { User, UserFilters } from '@/types/user'

async function fetchUsers(filters: UserFilters): Promise<User[]> {
  const params = new URLSearchParams()
  if (filters.status) params.set('status', filters.status)
  if (filters.type) params.set('type', filters.type)
  if (filters.search.trim()) params.set('search', filters.search.trim())
  const query = params.toString()
  const res = await fetch(`/api/users${query ? `?${query}` : ''}`)
  if (!res.ok) throw new Error('Falha ao carregar usuários')
  const data = await res.json()
  return data.users ?? data ?? []
}

export function useUsers(filters: UserFilters) {
  return useQuery({
    queryKey: ['users', filters],
    queryFn: () => fetchUsers(filters),
  })
}
