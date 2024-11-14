const { deepMockFunctions } = require("@hyulian/common");
const actual = jest.requireActual("@app/engine");

module.exports = {
  ...actual,
  JwtService: deepMockFunctions(actual.JwtService),
  UserEngine: mockClass(actual.UserEngine),
  MaterialEngine: mockClass(actual.MaterialEngine),
};

function mockClass(cls) {
  const instanceMethods = Object.getOwnPropertyNames(cls.prototype).filter(
    (method) =>
      method !== "constructor" && typeof cls.prototype[method] === "function"
  );
  for (const method of instanceMethods) {
    const temporalReference = cls[method];
    cls[method] = jest.fn().mockImplementation(temporalReference);
  }
  return cls;
}
