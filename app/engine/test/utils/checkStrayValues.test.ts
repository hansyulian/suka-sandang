import { checkStrayValues } from "~test/utils/checkStrayValues";

describe("testUtils: checkStrayValues", () => {
  it("should assert injected values are not present in an object", () => {
    const input = {
      existingKey: "value",
    };

    checkStrayValues(input);
  });

  it("should assert injected values are not present in an array of objects", () => {
    const input = [
      {
        existingKey1: "value1",
      },
      {
        existingKey2: "value2",
      },
    ];

    checkStrayValues(input);
  });
});
