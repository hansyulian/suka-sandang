export function sum<T>(data: T[], extractor: (record: T) => number) {
  let result = 0;
  for (const record of data) {
    result += extractor(record);
  }
  return result;
}
