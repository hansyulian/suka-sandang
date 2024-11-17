export function max<T>(data: T[], extractor: (record: T) => number) {
  let result = -Infinity;
  for (const record of data) {
    const value = extractor(record);
    if (value > result) {
      result = value;
    }
  }
  return result;
}
