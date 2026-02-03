import { findByIdPopulateAndSerialize } from '@db/populate-&-serialize/helpers/find-by-id-populate-and-serialize';
import type { TPopulateNode } from '@db/populate-&-serialize/types';
import type TUnknownRecord from '@infra/app-type-helpers/t-unknown-record';
import type { RulesFor } from '@serialization/dsl-types';
import type { Model } from 'mongoose';

export const createPopulateAndSerialize = async <
  TDbPopulated extends TUnknownRecord, // populated type
  TRules extends RulesFor<TDbPopulated>,
  TApi extends TUnknownRecord,
  TModelSchema extends TUnknownRecord, // schema type
>(
  model: Model<TModelSchema>,
  payload: TUnknownRecord,
  rules: TRules,
  populateConfig?: TPopulateNode | TPopulateNode[],
): Promise<TApi | null> => {
  const created = await model.create(payload);

  const result = await findByIdPopulateAndSerialize<TDbPopulated, TRules, TApi, TModelSchema>(
    model,
    String(created._id),
    rules,
    populateConfig,
  );

  if (!result) return null;

  return result;
};
