import type { Types as MongooseTypes } from 'mongoose';
import type { RuleFor, RulesFor, TSerializeEntityOfRule } from '../dsl-types';

//! Waiting for debugging - It doesn't work as intended yet

type TObjectIdLike = MongooseTypes.ObjectId;

// Default primitive transformation (no explicit rules)
type TDefaultTransform<T> = T extends Date ? string : T extends TObjectIdLike ? string : T;

// Applying one rule to a field type
type TApplyRule<TValue, TRule extends RuleFor<TValue>> = TRule['kind'] extends 'exclude'
  ? never
  : TRule['kind'] extends 'date'
    ? string
    : TRule['kind'] extends 'objectId'
      ? string
      : TRule['kind'] extends 'entityOf'
        ? TRule extends TSerializeEntityOfRule<infer TEntity>
          ? TEntity extends object
            ? TRule['rules'] extends RulesFor<TEntity>
              ? TSerializeType<TEntity, TRule['rules']>
              : TSerializeType<TEntity, {}>
            : TDefaultTransform<TValue>
          : TDefaultTransform<TValue>
        : TRule['kind'] extends 'rename'
          ? TValue
          : TValue extends Array<infer TItem>
            ? TItem extends object
              ? Array<TSerializeType<TItem, {}>>
              : TValue
            : TDefaultTransform<TValue>;

// Helper type: A rule for a specific field, cleared of undefined
type TRuleForField<TDb, TRules extends RulesFor<TDb>, K extends keyof TDb> = Extract<
  TRules[K],
  RuleFor<TDb[K]>
>;

// Basic serialization type: TDb + TRules → TApi
export type TSerializeType<TDb, TRules extends RulesFor<TDb>> = {
  // Keys:
  // - if there is a kind rule for a field: 'exclude' → throw away the key
  // - If there is a rule kind: 'rename' → use the new name
  // - otherwise → original name
  // Values:
  // - If there is a suitable rule, we apply it.
  // - otherwise → default transformation (Date/ObjectId → string)
  [K in keyof TDb as Extract<TRules[K], { kind: 'exclude' }> extends never
    ? Extract<TRules[K], { kind: 'rename'; to: string }> extends { to: infer New extends string }
      ? New
      : K
    : never]: TRuleForField<TDb, TRules, K> extends never
    ? TDefaultTransform<TDb[K]>
    : TApplyRule<TDb[K], TRuleForField<TDb, TRules, K>>;
};
