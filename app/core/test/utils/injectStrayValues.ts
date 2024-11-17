export const strayValues = {
  strayValue1: "stray value 1",
  injectedBoolean: true,
  someRandomNumber: 122332.58358,
};

export function injectStrayValues(value: Array<any> | any) {
  if (Array.isArray(value)) {
    const result = [];
    for (const record of value) {
      result.push({
        ...strayValues,
        ...record,
      });
    }
    return result;
  }
  return {
    ...strayValues,
    ...value,
  };
}
