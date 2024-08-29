import { Specs } from './types/Spec';

type ConstSchema<Keys extends string> = Record<Keys, Specs>;

/**
 * Function to create an schema, which will infer the typing very strictly to be used with Projection<T>.
 * @param objectSchema The schema map.
 * @returns The schema typestrict.
 */
export function objectSchema<
  TKeys extends string,
  TConstSchema extends ConstSchema<TKeys>,
>(objectSchema: TConstSchema) {
  return objectSchema;
}
