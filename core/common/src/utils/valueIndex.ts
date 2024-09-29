export function valueIndex(values: string[]) {
  const result: Record<string, number[]> = {};
  for (let i = 0; i < values.length; i += 1) {
    const value = values[i];
    result[value] = result[value] || [];
    result[value].push(i);
  }
  return result;
}
