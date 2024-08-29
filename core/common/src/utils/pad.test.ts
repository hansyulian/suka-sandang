// pad.test.ts
import { pad } from "./pad";

describe("@hyulian/common.pad", () => {
  it("should pad the string to the right with the given character", () => {
    expect(pad("test", 10, { char: "*" })).toBe("******test");
  });

  it("should pad the string to the left with the given character by default", () => {
    expect(pad("test", 10, { char: "*", align: "left" })).toBe("test******");
  });

  it("should pad the string to the left with spaces by default", () => {
    expect(pad("test", 10, { align: "left" })).toBe("test      ");
  });

  it("should return the original string if it is already longer than or equal to the desired length", () => {
    expect(pad("test", 4, { char: "*" })).toBe("test");
    expect(pad("test", 4)).toBe("test");
    expect(pad("longerString", 5)).toBe("longerString");
  });

  it("should throw an error if the padding character is not a single character", () => {
    expect(() => pad("test", 10, { char: "**" })).toThrow(
      "Padding character must be a single character."
    );
    expect(() => pad("test", 10, { char: "" })).toThrow(
      "Padding character must be a single character."
    );
  });

  it("should use default alignment left when not specified", () => {
    expect(pad("test", 10, { align: "left" })).toBe("test      ");
  });

  it("should handle cases when no options are provided", () => {
    expect(pad("test", 10)).toBe("      test");
  });
});
