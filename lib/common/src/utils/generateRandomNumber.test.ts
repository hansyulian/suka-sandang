import { generateRandomNumber } from "./generateRandomNumber";

describe("@hyulian/common.utils.generateRandomNumber", () => {
  it("should return a random number within the specified range", () => {
    const from = 0;
    const to = 10;
    const result = generateRandomNumber(from, to);
    // Verify that the result is within the specified range
    expect(result).toBeGreaterThanOrEqual(from);
    expect(result).toBeLessThanOrEqual(to);
    // Verify that the result is an integer
    expect(Number.isInteger(result)).toBe(true);
  });

  // Add more test cases as needed
});
