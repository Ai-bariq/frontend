import { useMemo } from 'react'
import { searchItems } from '../utils/Search'

export function useFilteredSearch<T extends Record<string, unknown>>(
  items: T[],
  query: string,
  fields: (keyof T)[]
) {
  return useMemo(() => {
    return searchItems(items, query, fields)
  }, [items, query, fields])
}