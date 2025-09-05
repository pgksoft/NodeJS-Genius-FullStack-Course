export function toDto<T extends Record<string, any>, K extends keyof T>(
  entity: T,
  omitKeys: K[],
): Omit<T, K> {
  const clone = { ...entity }
  for (const key of omitKeys) {
    delete clone[key]
  }
  return clone
}
