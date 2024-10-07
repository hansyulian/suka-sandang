import { compareArray, CompareArrayResult } from "./compareArray";

describe("@hyulian/common.utils.compareArray", () => {
  it("should compare two arrays and return the correct result", () => {
    // Define sample input arrays
    const leftArray = [1, 2, 3, 4];
    const rightArray = [3, 4, 5, 6];

    // Call the compareArray function with the sample input arrays
    const result = compareArray(leftArray, rightArray);

    // Define the expected result
    const expectedResult: CompareArrayResult<number, number> = {
      both: [3, 4],
      leftOnly: [1, 2],
      rightOnly: [5, 6],
    };

    // Assert that the result matches the expected result
    expect(result).toEqual(expectedResult);
  });

  it("should compare two arrays of different type with compare function", () => {
    type TestType = { id: string };
    const leftArray: TestType[] = [
      { id: "1" },
      { id: "2" },
      { id: "3" },
      { id: "4" },
    ];
    const rightArray: number[] = [3, 4, 5, 6];
    const result = compareArray(
      leftArray,
      rightArray,
      (left, right) => left.id === right.toString()
    );

    // Define the expected result
    const expectedResult: CompareArrayResult<TestType, number> = {
      both: [{ id: "3" }, { id: "4" }],
      leftOnly: [{ id: "1" }, { id: "2" }],
      rightOnly: [5, 6],
    };
    expect(result).toEqual(expectedResult);
  });
});
