const { deepMockFunctions } = require("@hyulian/common");
const actual = jest.requireActual("@app/engine");

module.exports = {
  ...actual,
  JwtService: deepMockFunctions(actual.JwtService),
  SessionFacade: deepMockFunctions(actual.SessionFacade),
  MaterialFacade: deepMockFunctions(actual.MaterialFacade),
  UserFacade: deepMockFunctions(actual.UserFacade),
};
