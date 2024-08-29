import { stringReplaceAll } from "./stringReplaceAll";

describe("@hyulian/common.utils.stringReplaceAll", () => {
  test("replaces all occurrences of search string with value", () => {
    const source = "hello world hello world";
    const search = "world";
    const value = "universe";
    const expectedResult = "hello universe hello universe";
    expect(stringReplaceAll(source, search, value)).toEqual(expectedResult);
  });

  test("replaces all occurrences of search string with value when search is a special character", () => {
    const source = "hello world, hello world,";
    const search = ",";
    const value = "!";
    const expectedResult = "hello world! hello world!";
    expect(stringReplaceAll(source, search, value)).toEqual(expectedResult);
  });

  test("returns the original string if search string is not found", () => {
    const source = "hello world";
    const search = "foo";
    const value = "bar";
    expect(stringReplaceAll(source, search, value)).toEqual(source);
  });
});
