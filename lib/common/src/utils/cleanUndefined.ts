export function cleanUndefined<T>(object: T): T {
  const result: any = Array.isArray(object) ? [] : {};
  for (const key in object) {
    const value = object[key];
    switch (typeof value) {
      case "undefined":
        if (Array.isArray(object)) {
          result[key] = value;
        }
        break;
      case "object":
        if (value === null) {
          result[key] = null;
        } else {
          result[key] = cleanUndefined(value);
        }
        break;
      default:
        result[key] = value;
    }
  }
  return result as T;
}
