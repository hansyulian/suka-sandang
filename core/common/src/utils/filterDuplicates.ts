type CompareFunction<T> = (a: T, b: T) => boolean;
const defaultCompareFunction: CompareFunction<unknown> = (a, b) => a === b;
export function filterDuplicates<T>(
  array: T[],
  compareFunction: CompareFunction<T> = defaultCompareFunction,
): T[] {
  const result = [];
  for (let i = 0; i < array.length; i += 1) {
    let found = false;
    for (let j = 0; j < i && !found; j += 1) {
      if (compareFunction(array[i], array[j])) {
        found = true;
        break;
      }
    }
    if (!found) {
      result.push(array[i]);
    }
  }
  return result;
}
