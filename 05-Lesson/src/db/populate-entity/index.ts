import type { Model } from 'mongoose';
import type { TSchemaSelection } from '@infra/app-type-helpers/t-schema-selection';
import { pickKeys } from '@helpers/pick-keys';
import { omitKeys } from '@helpers/omit-keys';
import type TUnknownRecord from '@infra/app-type-helpers/t-unknown-record';

/**
 * Populate helper for any entity with a reference field.
 * @param query - mongoose query (find, findOne, findById, etc.)
 * @param refField - name of the reference field (e.g. 'createBy', 'createdBy')
 * @param selection - fields from populated subdocument
 */
export const populateEntity = <
  T extends TUnknownRecord,
  K extends keyof T,
  S extends object,
  U extends keyof S,
>(
  query: ReturnType<Model<T>['find']> | ReturnType<Model<T>['findOne']>,
  refField: K,
  selection: TSchemaSelection<S, U> = { mode: 'all' },
) => {
  let projection: string | null = null;

  const { mode } = selection;
  mode === 'include' && (projection = selection.keys.join(' '));
  mode === 'exclude' && (projection = selection.keys.map((f) => `-${String(f)}`).join(' '));

  return projection
    ? query.populate(refField as string, projection)
    : query.populate(refField as string);
};

// «Syntactic sugar» for several populates
export const populateMany = <T extends object>(
  query: ReturnType<Model<T>['find']> | ReturnType<Model<T>['findOne']>,
  configs: Array<(q: typeof query) => typeof query>,
) => {
  return configs.reduce((acc, fn) => fn(acc), query);
};

/**
 * Serializer helper to strip sensitive fields from populated subdocument.
 */
export const serializeEntity = <
  T extends TUnknownRecord,
  K extends keyof T,
  S extends T[K] extends object ? T[K] : never,
  U extends keyof S,
>(
  entity: T,
  refField: K,
  selection: TSchemaSelection<S, U> = { mode: 'all' },
): T => {
  const subEntity = entity[refField] as S;
  if (!subEntity || typeof subEntity !== 'object') return entity;

  const { mode } = selection;
  const safe: Partial<S> = {};
  mode === 'all' && Object.assign(safe, { ...subEntity });
  mode === 'include' && Object.assign(safe, pickKeys(subEntity, selection.keys));
  mode === 'exclude' && Object.assign(safe, omitKeys(subEntity, selection.keys));

  return { ...entity, [refField]: safe };
};

export const serializeEntities = <
  T extends TUnknownRecord,
  K extends keyof T,
  S extends T[K] extends object ? T[K] : never,
  U extends keyof S,
>(
  entities: T[],
  refField: K,
  selection: TSchemaSelection<S, U> = { mode: 'all' },
) => {
  return entities.map((e) => serializeEntity<T, K, S, U>(e, refField, selection));
};

// «Syntactic sugar» for several serialize
export const serializeEntityMany = <T extends TUnknownRecord>(
  entity: T,
  configs: Array<{ field: keyof T; selection?: TSchemaSelection<any, any> }>,
): T => {
  return configs.reduce(
    (acc, { field, selection = { mode: 'all' } }) =>
      serializeEntity(acc, field as any, selection as any),
    entity,
  );
};

export const serializeEntitiesMany = <T extends TUnknownRecord>(
  entities: T[],
  configs: Array<{ field: keyof T; selection?: TSchemaSelection<any, any> }>,
) => {
  return entities.map((e) => serializeEntityMany(e, configs));
};
