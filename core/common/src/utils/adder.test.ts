import { adder } from "~/utils/adder";

describe("adder", () => {
  it("should add two positive numbers correctly", () => {
    expect(adder(2, 3)).toBe(5);
  });

  it("should add a positive number and a negative number correctly", () => {
    expect(adder(5, -3)).toBe(2);
  });

  it("should add two negative numbers correctly", () => {
    expect(adder(-2, -3)).toBe(-5);
  });

  it("should add zero and a number correctly", () => {
    expect(adder(0, 7)).toBe(7);
  });

  it("should add two zeros correctly", () => {
    expect(adder(0, 0)).toBe(0);
  });
});
