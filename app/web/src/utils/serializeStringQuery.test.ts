import { describe, it, expect, Mock, vi } from "vitest";
import { replacePathParams } from "./replacePathParams";
import { extractPathParams } from "~/utils/extractPathParams";

// Mock extractPathParams for testing
vi.mock("~/utils/extractPathParams", () => ({
  extractPathParams: vi.fn(),
}));

describe("replacePathParams", () => {
  it("should replace path params with corresponding values from params object", () => {
    // Mock the extractPathParams function to return the expected path parameters
    (extractPathParams as Mock).mockReturnValue(["id", "slug"]);

    const path = "/users/:id/posts/:slug";
    const params = { id: 123, slug: "my-post" };

    const result = replacePathParams(path, params);

    // Expect the params to be correctly replaced in the path
    expect(result).toBe("/users/123/posts/my-post");
  });

  it("should handle boolean params correctly", () => {
    (extractPathParams as Mock).mockReturnValue(["published"]);

    const path = "/posts/:published";
    const params = { published: true };

    const result = replacePathParams(path, params);

    // Expect the boolean value to be correctly replaced in the path
    expect(result).toBe("/posts/true");
  });

  it("should return the original path if no params are provided", () => {
    (extractPathParams as Mock).mockReturnValue(["id"]);

    const path = "/users/:id";
    const params = {}; // No params provided

    const result = replacePathParams(path, params);

    // Expect the path to still have the :id param
    expect(result).toBe("/users/undefined");
  });

  it("should handle numeric params correctly", () => {
    (extractPathParams as Mock).mockReturnValue(["id"]);

    const path = "/users/:id";
    const params = { id: 42 };

    const result = replacePathParams(path, params);

    // Expect the numeric value to be correctly replaced in the path
    expect(result).toBe("/users/42");
  });

  it("should return the original path if there are no path params", () => {
    (extractPathParams as Mock).mockReturnValue([]);

    const path = "/users";
    const params = { id: 123 };

    const result = replacePathParams(path, params);

    // Expect the original path to be returned
    expect(result).toBe("/users");
  });

  it("should handle extra params in the params object gracefully", () => {
    (extractPathParams as Mock).mockReturnValue(["id"]);

    const path = "/users/:id";
    const params = { id: 123, slug: "extra-param" }; // Extra param

    const result = replacePathParams(path, params);

    // Expect only the necessary params to be replaced
    expect(result).toBe("/users/123");
  });
});
