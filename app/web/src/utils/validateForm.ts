export function validateForm<T extends object, U extends Partial<T>>(
  value: T,
  spec: Record<keyof U, (value: unknown) => string | undefined>
) {
  type KeyT = keyof U;
  const errors: string[] = [];
  const keys = Object.keys(spec) as KeyT[];
  for (const key of keys) {
    const validationResult = spec[key](value[key as keyof T]);
    if (validationResult) {
      errors.push(validationResult);
    }
  }
  return errors;
}
