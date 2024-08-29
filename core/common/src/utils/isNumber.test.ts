import { isNumber } from "./isNumber";

describe("@hyulian/common.utils.isNumber", () => {
  it("should return true for valid numbers", () => {
    expect(isNumber(123)).toBe(true);
    expect(isNumber(0)).toBe(true);
    expect(isNumber(-456)).toBe(true);
    expect(isNumber(3.14)).toBe(true);
    expect(isNumber("123")).toBe(true); // Strings representing numbers should return true
    expect(isNumber("3.14")).toBe(true);
    expect(isNumber("0")).toBe(true);
    expect(isNumber("-456")).toBe(true);
  });

  it("should return false for non-numbers", () => {
    expect(isNumber("abc")).toBe(false);
    expect(isNumber("")).toBe(false);
    expect(isNumber(null)).toBe(false);
    expect(isNumber(undefined)).toBe(false);
    expect(isNumber([])).toBe(false);
    expect(isNumber({})).toBe(false);
    expect(isNumber(NaN)).toBe(false);
    expect(isNumber(true)).toBe(false);
    expect(isNumber(false)).toBe(false);
  });

  // Add more test cases as needed
});
