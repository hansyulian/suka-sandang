import { calculateCode } from "~/utils/calculateCode";

describe("calculateCode", () => {
  it("should convert spaces to hyphens and lowercase the string", () => {
    expect(calculateCode("John Doe")).toBe("john-doe");
  });

  it("should handle multiple spaces between words", () => {
    expect(calculateCode("John   Doe")).toBe("john-doe");
  });

  it("should handle leading and trailing spaces", () => {
    expect(calculateCode("  John Doe  ")).toBe("john-doe");
  });

  it("should return an empty string if input is empty", () => {
    expect(calculateCode("")).toBe("");
  });

  it("should handle strings with no spaces", () => {
    expect(calculateCode("JohnDoe")).toBe("johndoe");
  });

  it("should handle special characters", () => {
    expect(calculateCode("John Doe!")).toBe("john-doe");
  });

  it("should handle numbers and special characters", () => {
    expect(calculateCode("User 123")).toBe("user-123");
  });
});
