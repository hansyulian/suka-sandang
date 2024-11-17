export function deepMockFunctions(section: any) {
  const result: any = {};
  for (const key in section) {
    const sectionType = typeof section[key];
    if (sectionType === "function") {
      result[key] = jest.fn().mockImplementation(section[key]);
    } else if (sectionType === "object") {
      result[key] = deepMockFunctions(section[key]);
    } else {
      result[key] = section[key];
    }
  }
  return result;
}
