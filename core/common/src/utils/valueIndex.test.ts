import { valueIndex } from "~/utils/valueIndex";

describe("valueIndex", () => {
  it("should return an empty object when an empty array is passed", () => {
    const values: string[] = [];
    const result = valueIndex(values);
    expect(result).toEqual({});
  });

  it("should return correct indices for unique values", () => {
    const values = ["a", "b", "c"];
    const result = valueIndex(values);
    expect(result).toEqual({
      a: [0],
      b: [1],
      c: [2],
    });
  });

  it("should return correct indices for repeated values", () => {
    const values = ["a", "b", "a", "c", "b", "a"];
    const result = valueIndex(values);
    expect(result).toEqual({
      a: [0, 2, 5],
      b: [1, 4],
      c: [3],
    });
  });

  it("should handle an array with a single value", () => {
    const values = ["a"];
    const result = valueIndex(values);
    expect(result).toEqual({
      a: [0],
    });
  });

  it("should handle an array with all values being the same", () => {
    const values = ["a", "a", "a", "a"];
    const result = valueIndex(values);
    expect(result).toEqual({
      a: [0, 1, 2, 3],
    });
  });

  it("should handle an array with mixed empty strings and other values", () => {
    const values = ["", "a", "", "b"];
    const result = valueIndex(values);
    expect(result).toEqual({
      "": [0, 2],
      a: [1],
      b: [3],
    });
  });
});
