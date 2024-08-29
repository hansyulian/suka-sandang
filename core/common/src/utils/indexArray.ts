import { KeyValuePair } from '../types';

export function indexArray<T extends Object, K extends keyof T>(
  array: T[],
  indexKey: K,
): KeyValuePair<T> {
  const result: KeyValuePair<T> = {};
  for (const element of array) {
    result[(element as any)[indexKey]] = element;
  }
  return result;
}
