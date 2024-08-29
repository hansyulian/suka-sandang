type ParamsMap<T extends object> = {
  [K in keyof T]: string;
};

export function createExpressParamsMap<T extends object>(obj: T): ParamsMap<T> {
  const result = {} as ParamsMap<T>;
  for (const key in obj) {
    if (obj.hasOwnProperty(key)) {
      result[key as keyof T] = `{${key}}` as ParamsMap<T>[keyof T];
    }
  }
  return result;
}
