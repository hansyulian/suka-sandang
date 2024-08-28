import { subtractor } from "~/utils/subtractor";

describe("subtractor function", () => {
  it("should correctly subtract two numbers", () => {
    expect(subtractor(10, 5)).toBe(5);
    expect(subtractor(0, 0)).toBe(0);
    expect(subtractor(-5, -5)).toBe(0);
    expect(subtractor(-5, 5)).toBe(-10);
  });

  it("should handle subtracting from a negative number", () => {
    expect(subtractor(-10, 5)).toBe(-15);
    expect(subtractor(-10, -5)).toBe(-5);
  });

  it("should handle subtracting zero", () => {
    expect(subtractor(10, 0)).toBe(10);
    expect(subtractor(0, 10)).toBe(-10);
  });
});
