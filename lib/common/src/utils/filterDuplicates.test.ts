import { filterDuplicates } from "./filterDuplicates";

// Import path follows the pattern

describe("@hyulian/common.utils.filterDuplicates", () => {
  it("should remove duplicate elements from an array while preserving order", () => {
    const inputArray = [1, 2, 3, 2, 4, 3, 5];
    const expectedResult = [1, 2, 3, 4, 5];
    const result = filterDuplicates(inputArray);
    expect(result).toEqual(expectedResult);
  });

  it("should remove duplicated object as well", () => {
    const obj1 = { a: 1 };
    const obj2 = { a: 2 };
    const inputArray = [obj1, obj2, obj1];
    const expectedResult = [obj1, obj2];
    const result = filterDuplicates(inputArray);
    expect(result).toEqual(expectedResult);
  });
  it("should remove object considered duplicated by compare function", () => {
    const obj1 = { id: 1 };
    const obj2 = { id: 2 };
    const obj3 = { id: 1 };
    const inputArray = [obj1, obj2, obj3];
    const expectedResult = [obj1, obj2];
    const result = filterDuplicates(inputArray, (a, b) => a.id === b.id);
    expect(result).toEqual(expectedResult);
  });
});
