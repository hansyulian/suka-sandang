import { cleanUndefined } from "~/utils/cleanUndefined";

describe("cleanUndefined", () => {
  it("should remove undefined values from a flat object", () => {
    const input = {
      a: 1,
      b: undefined,
      c: "test",
    };

    const expectedOutput = {
      a: 1,
      c: "test",
    };

    const result = cleanUndefined(input);
    expect(result).toEqual(expectedOutput);
  });

  it("should handle objects without undefined values", () => {
    const input = {
      a: 1,
      b: "hello",
      c: true,
    };

    const expectedOutput = { ...input }; // No changes expected

    const result = cleanUndefined(input);
    expect(result).toEqual(expectedOutput);
  });

  it("should recursively clean undefined values from nested objects", () => {
    const input = {
      a: 1,
      b: undefined,
      c: {
        d: 2,
        e: undefined,
        f: {
          g: undefined,
          h: 3,
        },
      },
    };

    const expectedOutput = {
      a: 1,
      c: {
        d: 2,
        f: {
          h: 3,
        },
      },
    };

    const result = cleanUndefined(input);
    expect(result).toEqual(expectedOutput);
  });

  it("should handle empty objects", () => {
    const input = {};

    const expectedOutput = {};

    const result = cleanUndefined(input);
    expect(result).toEqual(expectedOutput);
  });

  it("should handle objects with null values (null values should not be removed)", () => {
    const input = {
      a: 1,
      b: null,
      c: undefined,
    };

    const expectedOutput = {
      a: 1,
      b: null, // null should not be removed
    };

    const result = cleanUndefined(input);
    expect(result).toEqual(expectedOutput);
  });

  it("should handle arrays inside objects (should not modify arrays)", () => {
    const input = {
      a: 1,
      b: undefined,
      c: [1, undefined, 2, null],
    };

    const expectedOutput = {
      a: 1,
      c: [1, undefined, 2, null], // Arrays should not be modified
    };

    const result = cleanUndefined(input);
    expect(result).toEqual(expectedOutput);
  });
});
