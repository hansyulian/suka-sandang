import { sum } from "~/utils/sum";

describe("sum utility function", () => {
  it("should return 0 for an empty array", () => {
    const result = sum([], (record) => record);
    expect(result).toBe(0);
  });

  it("should return the sum of numbers in the array", () => {
    const data = [{ value: 1 }, { value: 2 }, { value: 3 }];
    const result = sum(data, (record) => record.value);
    expect(result).toBe(6);
  });

  it("should handle negative numbers", () => {
    const data = [{ value: -1 }, { value: -2 }, { value: -3 }];
    const result = sum(data, (record) => record.value);
    expect(result).toBe(-6);
  });

  it("should handle a mix of positive and negative numbers", () => {
    const data = [{ value: 1 }, { value: -2 }, { value: 3 }];
    const result = sum(data, (record) => record.value);
    expect(result).toBe(2);
  });

  it("should handle a custom extractor function", () => {
    const data = [
      { price: 10, quantity: 2 },
      { price: 20, quantity: 1 },
      { price: 5, quantity: 4 },
    ];
    const result = sum(data, (record) => record.price * record.quantity);
    expect(result).toBe(60); // (10 * 2) + (20 * 1) + (5 * 4) = 20 + 20 + 20 = 60
  });

  it("should return 0 if all extracted values are 0", () => {
    const data = [{ value: 0 }, { value: 0 }, { value: 0 }];
    const result = sum(data, (record) => record.value);
    expect(result).toBe(0);
  });

  it("should handle undefined values gracefully", () => {
    const data = [{ value: 1 }, { value: undefined }, { value: 2 }];
    const result = sum(data, (record) => record.value || 0); // Treat undefined as 0
    expect(result).toBe(3);
  });
});
