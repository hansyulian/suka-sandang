import { describe, test, expect } from "vitest";
import { calculateSlug } from "~/utils/calculateSlug";

describe("calcualteSlug", () => {
  test("should convert string to lowercase and replace spaces with hyphens", () => {
    expect(calculateSlug("Material 1")).toBe("material-1");
  });

  test("should handle multiple spaces correctly", () => {
    expect(calculateSlug("Material   1")).toBe("material-1"); // Handle extra spaces
  });

  test("should handle no spaces", () => {
    expect(calculateSlug("Material1")).toBe("material1");
  });

  test("should handle all spaces", () => {
    expect(calculateSlug("     ")).toBe("-"); // Convert spaces to hyphens
  });

  test("should handle empty string", () => {
    expect(calculateSlug("")).toBe(""); // Edge case for empty input
  });

  test("should handle string with special characters", () => {
    expect(calculateSlug("Material & Special!")).toBe("material-&-special!");
  });
});
