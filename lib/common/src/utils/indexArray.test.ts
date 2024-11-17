import { KeyValuePair } from "../types";
import { indexArray } from "./indexArray";

// Replace 'your-module' with the path to your module

describe("@hyulian/common.utils.indexArray", () => {
  // Test case: empty input array
  it("should return an empty object for an empty input array", () => {
    const array: any[] = [];
    const result = indexArray(array, "id"); // Assuming 'id' is a common index key
    expect(result).toEqual({});
  });

  // Test case: input array with objects indexed by a common key
  it("should index an array of objects by a common key", () => {
    const array = [
      { id: 1, name: "Alice" },
      { id: 2, name: "Bob" },
      { id: 3, name: "Charlie" },
    ];
    const result = indexArray(array, "id");
    const expectedResult: KeyValuePair<(typeof array)[0]> = {
      1: { id: 1, name: "Alice" },
      2: { id: 2, name: "Bob" },
      3: { id: 3, name: "Charlie" },
    };
    expect(result).toEqual(expectedResult);
  });

  // Test case: input array with objects indexed by a non-existent key
  it("should handle indexing by a non-existent key", () => {
    const array = [
      { age: 1, name: "Alice" },
      { age: 2, name: "Bob" },
      { age: 3, name: "Charlie" },
    ];
    const result = indexArray(array, "age"); // Assuming 'age' does not exist as a key in the objects
    const expectedResult: KeyValuePair<(typeof array)[0]> = {
      1: { age: 1, name: "Alice" },
      2: { age: 2, name: "Bob" },
      3: { age: 3, name: "Charlie" },
    };
    expect(result).toEqual(expectedResult);
  });

  // Add more test cases as needed
});
