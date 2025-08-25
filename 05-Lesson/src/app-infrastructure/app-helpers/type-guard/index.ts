type TypeGuard<T> = (value: unknown) => value is T

export default TypeGuard

export type TUnknownRecord = Record<string, unknown>
