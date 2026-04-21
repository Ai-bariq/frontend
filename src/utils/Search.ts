type Primitive = string | number | null | undefined

function normalize(value: Primitive) {
  return String(value ?? '')
    .toLowerCase()
    .trim()
    .replace(/\s+/g, ' ')
}

export function searchItems<T extends Record<string, unknown>>(
  items: T[],
  query: string,
  fields: (keyof T)[]
): T[] {
  const normalizedQuery = normalize(query)

  if (!normalizedQuery) return items

  return items.filter((item) =>
    fields.some((field) => {
      const value = normalize(item[field] as Primitive)
      return value.includes(normalizedQuery)
    })
  )
}