import { Types } from 'mongoose';
import type { TSerializationRules, TSerializeRule } from '../dsl-types';
import type TUnknownRecord from '@infra/app-type-helpers/t-unknown-record';

type TNormalizedRules = TSerializationRules;

const rulesCache = new WeakMap<object, TNormalizedRules>();
const emptyRules: TSerializationRules = {};

const normalizeRules = (rules: TSerializationRules): TNormalizedRules => {
  // здесь в будущем можно делать валидацию, нормализацию и т.п.
  return rules;
};

const getNormalizedRules = (rules: TSerializationRules): TNormalizedRules => {
  const cached = rulesCache.get(rules);
  if (cached) return cached;
  const normalized = normalizeRules(rules);
  rulesCache.set(rules, normalized);
  return normalized;
};

export const serializeEntity = <TDbPopulated, TApi>(
  entity: TDbPopulated,
  rules: TSerializationRules = emptyRules,
): TApi => {
  const normalizedRules = getNormalizedRules(rules);
  return innerSerializeEntity<TDbPopulated, TApi>(entity, normalizedRules);
};

const innerSerializeEntity = <TDb, TApi>(entity: TDb, rules: TSerializationRules): TApi => {
  const result: TUnknownRecord = {};
  const entityRecord = entity as unknown as Record<string, unknown>;

  for (const key in entityRecord) {
    const value = entityRecord[key];
    const rule: TSerializeRule | undefined = rules[key];

    // exclude
    if (rule?.kind === 'exclude') continue;

    // rename
    const targetKey = rule?.kind === 'rename' ? rule.to : key;

    // date (явное правило или фактический тип)
    if (rule?.kind === 'date' || value instanceof Date) {
      const asDate = value as Date | null | undefined;
      result[targetKey] = asDate?.toISOString?.() ?? null;
      continue;
    }

    // objectId (явное правило или фактический тип)
    if (rule?.kind === 'objectId' || value instanceof Types.ObjectId) {
      const asObjectId = value as Types.ObjectId | null | undefined;
      result[targetKey] = asObjectId?.toString?.() ?? null;
      continue;
    }

    // entityOf — вложенная сущность
    if (rule?.kind === 'entityOf') {
      result[targetKey] = innerSerializeEntity<unknown, unknown>(value, rule.rules ?? emptyRules);
      continue;
    }

    // array
    if (Array.isArray(value)) {
      const itemRules = getNestedRules(rule);

      result[targetKey] = value.map((v) => {
        if (v !== null && typeof v === 'object') {
          return innerSerializeEntity<unknown, unknown>(v, itemRules);
        }
        return v;
      });
      continue;
    }

    // nested object без явного entityOf, но с rules внутри
    if (value !== null && typeof value === 'object') {
      const nestedRules = getNestedRules(rule);

      result[targetKey] = innerSerializeEntity<unknown, unknown>(value, nestedRules);
      continue;
    }

    // примитив без спец. правил
    result[targetKey] = value;
  }

  return result as TApi;
};

const getNestedRules = (rule: TSerializeRule | undefined): TSerializationRules => {
  if (rule && 'rules' in rule && rule.rules) {
    return rule.rules;
  }
  return emptyRules;
};
