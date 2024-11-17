import { injectStrayValues } from "~test/utils/injectStrayValues";

describe("testUtils: injectStrayValues", () => {
  it("should inject values into an object", () => {
    const input = { existingKey: "value" };
    const expected = {
      existingKey: "value",
      strayValue1: "stray value 1",
      injectedBoolean: true,
      someRandomNumber: 122332.58358,
    };

    expect(injectStrayValues(input)).toEqual(expected);
  });

  it("should inject values into an array of objects", () => {
    const input = [{ existingKey1: "value1" }, { existingKey2: "value2" }];
    const expected = [
      {
        existingKey1: "value1",
        strayValue1: "stray value 1",
        injectedBoolean: true,
        someRandomNumber: 122332.58358,
      },
      {
        existingKey2: "value2",
        strayValue1: "stray value 1",
        injectedBoolean: true,
        someRandomNumber: 122332.58358,
      },
    ];

    expect(injectStrayValues(input)).toEqual(expected);
  });
});
