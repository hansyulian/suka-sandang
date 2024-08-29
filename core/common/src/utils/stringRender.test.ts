import { stringRender } from "./stringRender";

describe("@hyulian/common.utils.stringRender", () => {
  beforeEach(() => {
    jest.clearAllMocks(); // Reset mock calls before each test
  });

  it("should render template with provided data", () => {
    const template = "Hello {name}, you have {count} messages.";
    const data = { name: "Alice", count: 3 };
    const expectedResult = "Hello Alice, you have 3 messages.";

    const result = stringRender(template, data);

    expect(result).toBe(expectedResult);
  });

  it("should handle empty data", () => {
    const template = "Hello {name}, you have {count} messages.";
    const data = {};
    const expectedResult = "Hello {name}, you have {count} messages.";

    const result = stringRender(template, data);

    expect(result).toBe(expectedResult);
  });

  // Add more test cases as needed
});
