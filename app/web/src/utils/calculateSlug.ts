export function calculateSlug(value: string) {
  return value.toLowerCase().replace(/\s+/g, "-");
}
