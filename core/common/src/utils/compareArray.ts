export type CompareResult<T> = {
  both: T[];
  leftOnly: T[];
  rightOnly: T[];
};
export function compareArray<T>(left: T[], right: T[]): CompareResult<T> {
  const both: T[] = [];
  const leftOnly: T[] = [];
  const rightOnly: T[] = [];
  for (const record of left) {
    let found = false;
    for (const opposite of right) {
      if (record === opposite) {
        both.push(record);
        found = true;
        break;
      }
    }
    if (found) {
      continue;
    }
    leftOnly.push(record);
  }
  for (const record of right) {
    let found = false;
    for (const opposite of left) {
      if (record === opposite) {
        found = true;
        break;
      }
    }
    if (found) {
      continue;
    }
    rightOnly.push(record);
  }
  return {
    both,
    leftOnly,
    rightOnly,
  };
}
