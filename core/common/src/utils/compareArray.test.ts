import { compareArray, CompareResult } from "./compareArray";

describe("@hyulian/common.utils.compareArray", () => {
  it("should compare two arrays and return the correct result", () => {
    // Define sample input arrays
    const leftArray = [1, 2, 3, 4];
    const rightArray = [3, 4, 5, 6];

    // Call the compareArray function with the sample input arrays
    const result = compareArray(leftArray, rightArray);

    // Define the expected result
    const expectedResult: CompareResult<number> = {
      both: [3, 4],
      leftOnly: [1, 2],
      rightOnly: [5, 6],
    };

    // Assert that the result matches the expected result
    expect(result).toEqual(expectedResult);
  });

  // Add more test cases as needed
});
