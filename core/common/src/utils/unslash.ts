export function unslash(value: string) {
  return value.replace(/^\/+|\/+$/g, '').replace(/\/{2,}/g, '/');
}
