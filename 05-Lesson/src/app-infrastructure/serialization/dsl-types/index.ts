// Базовые правила (без дженериков, без flatten/custom/include/entity)
export type TSerializeExcludeRule = {
  kind: 'exclude';
};

export type TSerializeRenameRule = {
  kind: 'rename';
  to: string;
};

export type TSerializePrimitiveRule = { kind: 'date' } | { kind: 'objectId' };

// Типизированное правило для вложенной сущности
// Ключевая идея: generic <TEntity> даёт типобезопасный TApi.
export type TSerializeEntityOfRule<TEntity = unknown> = {
  kind: 'entityOf';
  // Правила для полей вложенной сущности
  rules?: RulesFor<TEntity>;
};

// Общее правило для одного поля типа TValue
export type RuleFor<TValue> =
  | TSerializeExcludeRule
  | TSerializeRenameRule
  | TSerializePrimitiveRule
  | TSerializeEntityOfRule<TValue>;

// Универсальное "runtime" правило
export type TSerializeRule = RuleFor<unknown>;

// Набор правил для сущности на runtime‑уровне (общий, небезопасный по ключам)
// ВАЖНО: значения могут быть undefined, потому что строгие RulesFor<T>
// дают нам RuleFor<T[K]> | undefined
export type TSerializationRules = Record<string, TSerializeRule | undefined>;

// Строгий вариант: правила для конкретного T по его ключам.
export type RulesFor<T> = {
  [K in keyof T]?: RuleFor<T[K]>;
};
