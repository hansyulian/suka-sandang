const actual = jest.requireActual("jsonwebtoken");
const { deepMockFunctions } = require("@hyulian/common");

module.exports = {
  ...deepMockFunctions(actual),
};
