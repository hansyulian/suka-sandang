export type CompareArrayResult<Left, Right> = {
  both: Left[];
  leftOnly: Left[];
  rightOnly: Right[];
};
export type CompareArrayFunction<Left, Right> = (
  left: Left,
  right: Right
) => boolean;
export function compareArray<Left, Right>(
  leftArray: Left[],
  rightArray: Right[],
  compareFunction: CompareArrayFunction<Left, Right> = (left, right) =>
    (left as any) === right
): CompareArrayResult<Left, Right> {
  const both: Left[] = [];
  const leftOnly: Left[] = [];
  const rightOnly: Right[] = [];
  for (const left of leftArray) {
    let found = false;
    for (const right of rightArray) {
      if (compareFunction(left, right)) {
        both.push(left);
        found = true;
        break;
      }
    }
    if (found) {
      continue;
    }
    leftOnly.push(left);
  }
  for (const right of rightArray) {
    let found = false;
    for (const left of leftArray) {
      if (compareFunction(left, right)) {
        found = true;
        break;
      }
    }
    if (found) {
      continue;
    }
    rightOnly.push(right);
  }
  return {
    both,
    leftOnly,
    rightOnly,
  };
}
