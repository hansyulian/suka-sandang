function deepMockFunctions(section) {
  const result = {};
  for (const key in section) {
    sectionType = typeof section[key];
    if (sectionType === "function") {
      result[key] = jest.fn();
    } else if (sectionType === "object") {
      result[key] = deepMockFunctions(section[key]);
    } else {
      result[key] = section[key];
    }
  }
  return result;
}
module.exports = deepMockFunctions;
