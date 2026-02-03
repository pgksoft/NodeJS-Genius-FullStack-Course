import type { Types as MongooseTypes } from 'mongoose';
import type { RuleFor, RulesFor, TSerializeEntityOfRule } from '../dsl-types';

type TObjectIdLike = MongooseTypes.ObjectId;

// Преобразование примитивов по умолчанию (без явных правил)
type TDefaultTransform<T> = T extends Date ? string : T extends TObjectIdLike ? string : T;

// Применение одного правила к типу поля
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

// Вспомогательный тип: правило для конкретного поля, очищенное от undefined
type TRuleForField<TDb, TRules extends RulesFor<TDb>, K extends keyof TDb> = Extract<
  TRules[K],
  RuleFor<TDb[K]>
>;

// Основной тип сериализации: TDb + TRules → TApi
export type TSerializeType<TDb, TRules extends RulesFor<TDb>> = {
  // Ключи:
  // - если для поля есть правило kind: 'exclude' → выкидываем ключ
  // - если есть правило kind: 'rename' → используем новое имя
  // - иначе → оригинальное имя
  // Значения:
  // - если есть подходящее правило → применяем его
  // - иначе → дефолтное преобразование (Date/ObjectId → string)
  [K in keyof TDb as Extract<TRules[K], { kind: 'exclude' }> extends never
    ? Extract<TRules[K], { kind: 'rename'; to: string }> extends { to: infer New extends string }
      ? New
      : K
    : never]: TRuleForField<TDb, TRules, K> extends never
    ? TDefaultTransform<TDb[K]>
    : TApplyRule<TDb[K], TRuleForField<TDb, TRules, K>>;
};
