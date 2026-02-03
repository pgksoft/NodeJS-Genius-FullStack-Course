import type { HydratedDocument, Model, Schema } from 'mongoose';

export type IntervalFieldNames<T> = {
  start: keyof T & string;
  end: keyof T & string;
  scope?: keyof T & string; // for example, taskId - to search for the "previous" interval
};

export type IntervalValidatorOptions = {
  enforceContinuity?: boolean; // end(prev) === start(current)
  enforceNoOverlap?: boolean; // intervals must not overlap
};

/**
 * Connects professional interval validators to Mongoose schema.
 */
export function applyIntervalValidators<T extends object>(
  schema: Schema<T>,
  fields: IntervalFieldNames<T>,
  options: IntervalValidatorOptions = {},
) {
  const { start, end, scope } = fields;
  const { enforceContinuity = false, enforceNoOverlap = false } = options;

  //
  // 1. Local invariant: end > start
  //
  schema.path(end).validate({
    validator(value: Date | null) {
      const startValue = this[start] as unknown as Date;
      if (value === null) return true;
      return value > startValue;
    },
    message: `${end} must be greater than ${start}`,
  });

  //
  // 2.Global invariants - via pre('validate')
  //
  schema.pre('validate', async function (next) {
    const doc = this as HydratedDocument<T>;

    // If there is no scope, global checks are not possible.
    if (!scope) return next();

    const model = doc.constructor as Model<T>;

    const startValue = doc[start] as unknown as Date;
    const endValue = doc[end] as unknown as Date | null;
    const scopeValue = doc[scope];

    //
    // 2.1. enforceContinuity: end(prev) === start(current)
    //
    if (enforceContinuity) {
      const previous = await model
        .findOne({ [scope]: scopeValue, _id: { $ne: doc._id } })
        .sort({ [end]: -1 })
        .lean<T>();

      if (previous) {
        const prevEnd = previous[end] as unknown as Date | null;

        if (prevEnd?.getTime() !== startValue?.getTime()) {
          doc.invalidate(start, `${start} must equal previous ${end} (interval continuity rule)`);
        }
      }
    }

    //
    // 2.2. enforceNoOverlap: intervals must not overlap
    //
    if (enforceNoOverlap) {
      const overlapping = await model.exists({
        [scope]: scopeValue,
        _id: { $ne: doc._id },
        [start]: { $lt: endValue ?? new Date(8640000000000000) },
        [end]: { $gt: startValue },
      });

      if (overlapping) {
        doc.invalidate(start, `Interval overlaps with an existing record (no-overlap rule)`);
      }
    }

    next();
  });
}
