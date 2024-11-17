import { isEmpty } from "./isEmpty";

// Import path follows the pattern

describe("@hyulian/common.utils.isEmpty", () => {
  it("should return true for undefined", () => {
    expect(isEmpty(undefined)).toBe(true);
  });

  it("should return true for null", () => {
    expect(isEmpty(null)).toBe(true);
  });

  it("should return true for empty object", () => {
    expect(isEmpty({})).toBe(true);
  });

  it("should return false for non-empty object", () => {
    expect(isEmpty({ key: "value" })).toBe(false);
  });

  it("should return false for non-empty string", () => {
    expect(isEmpty("test")).toBe(false);
  });

  it("should return true for empty string", () => {
    expect(isEmpty("")).toBe(true);
  });

  it("should return false for non-empty array", () => {
    expect(isEmpty([1, 2, 3])).toBe(false);
  });

  it("should return true for empty array", () => {
    expect(isEmpty([])).toBe(true);
  });

  it("should return false for non-empty number", () => {
    expect(isEmpty(123)).toBe(false);
  });

  it("should return false for zero number", () => {
    expect(isEmpty(0)).toBe(false);
  });

  it("should return false for non-empty boolean", () => {
    expect(isEmpty(true)).toBe(false);
    expect(isEmpty(false)).toBe(false);
  });

  it("should return false for non-empty string representation of an object", () => {
    expect(isEmpty({ key: "value" }.toString())).toBe(false);
  });

  // Add more test cases as needed
});
