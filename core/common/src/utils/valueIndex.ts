export function valueIndex<T extends string = string>(values: T[]) {
  const result: Record<T, number[]> = {} as any;
  for (let i = 0; i < values.length; i += 1) {
    const value = values[i];
    result[value] = result[value] || [];
    result[value].push(i);
  }
  return result as Record<T, number[]>;
}
