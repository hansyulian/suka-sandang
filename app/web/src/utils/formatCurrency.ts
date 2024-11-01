export function formatCurrency(value: number | undefined) {
  if (value === undefined) {
    return "";
  }
  return value.toLocaleString();
}
