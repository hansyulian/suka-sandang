import { max } from "~/utils/max";

describe("max", () => {
  it("should return the maximum value from an array of numbers", () => {
    const data = [1, 5, 3, 9, 2];
    const result = max(data, (record) => record);
    expect(result).toBe(9);
  });

  it("should return the maximum extracted value from an array of objects", () => {
    const data = [
      { id: 1, value: 10 },
      { id: 2, value: 15 },
      { id: 3, value: 7 },
    ];
    const result = max(data, (record) => record.value);
    expect(result).toBe(15);
  });

  it("should return -Infinity for an empty array", () => {
    const data: number[] = [];
    const result = max(data, (record) => record);
    expect(result).toBe(-Infinity);
  });

  it("should return the maximum value for an array with negative numbers", () => {
    const data = [-5, -10, -3, -20];
    const result = max(data, (record) => record);
    expect(result).toBe(-3);
  });

  it("should handle an array with a single element", () => {
    const data = [42];
    const result = max(data, (record) => record);
    expect(result).toBe(42);
  });

  it("should handle cases where all elements are the same", () => {
    const data = [4, 4, 4, 4];
    const result = max(data, (record) => record);
    expect(result).toBe(4);
  });
});
