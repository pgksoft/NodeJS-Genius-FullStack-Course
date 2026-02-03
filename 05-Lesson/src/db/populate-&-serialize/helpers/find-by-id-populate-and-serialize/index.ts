import type { TMongooseQueryOne, TPopulateNode } from '@db/populate-&-serialize/types';
import type TUnknownRecord from '@infra/app-type-helpers/t-unknown-record';
import type { RulesFor } from '@serialization/dsl-types';
import { serializeEntity } from '@serialization/serialize';
import type { Model } from 'mongoose';
import { getQueryFromPopulateConfig } from '../get-query-from-populate-config';

export const findByIdPopulateAndSerialize = async <
  TDbPopulated extends TUnknownRecord, // populated type
  TRules extends RulesFor<TDbPopulated>,
  TApi extends TUnknownRecord,
  TModelSchema extends TUnknownRecord, // schema type
>(
  model: Model<TModelSchema>,
  id: string,
  rules: TRules,
  populateConfig?: TPopulateNode | TPopulateNode[],
): Promise<TApi | null> => {
  let query = model.findById(id) as TMongooseQueryOne<TModelSchema>;

  if (populateConfig) {
    query = getQueryFromPopulateConfig<TModelSchema, TMongooseQueryOne<TModelSchema>>(
      query,
      populateConfig,
    );
  }

  const populated = await query.lean<TDbPopulated>().exec();
  if (!populated) return null;

  return serializeEntity<TDbPopulated, TApi>(populated, rules);
};
