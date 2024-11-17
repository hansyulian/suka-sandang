export function isNumber(value: unknown): boolean {
  if (typeof value === 'string') {
    return !isNaN(parseFloat(value));
  }
  if (typeof value !== 'number') {
    return false;
  }
  return !isNaN(value);
}
