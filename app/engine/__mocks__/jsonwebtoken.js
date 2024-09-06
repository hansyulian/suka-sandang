const actual = jest.requireActual("jsonwebtoken");

module.exports = {
  ...actual,
  sign: jest.fn(),
  verify: jest.fn(),
  decode: jest.fn(),
};
