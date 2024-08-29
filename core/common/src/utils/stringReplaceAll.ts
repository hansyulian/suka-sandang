export function stringReplaceAll(
  source: string,
  search: string,
  value: string,
): string {
  const regex = new RegExp(search, 'g');
  return source.replace(regex, value);
}
