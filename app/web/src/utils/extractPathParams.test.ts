import { extractPathParams } from "~/utils/extractPathParams";

describe("extractPathParams", () => {
  it("should extract parameters from a path with multiple parameters", () => {
    const path = "/user/:userId/role/:roleId";
    const result = extractPathParams(path);
    expect(result).toEqual(["userId", "roleId"]);
  });

  it("should return an empty array if there are no parameters", () => {
    const path = "/user/123/role/admin";
    const result = extractPathParams(path);
    expect(result).toEqual([]);
  });

  it("should handle a path with a single parameter", () => {
    const path = "/user/:userId";
    const result = extractPathParams(path);
    expect(result).toEqual(["userId"]);
  });

  it("should handle a path with no parameters", () => {
    const path = "/";
    const result = extractPathParams(path);
    expect(result).toEqual([]);
  });

  it("should handle a path with parameters that have non-word characters", () => {
    const path = "/user/:userId-123/role/:roleId/extra";
    const result = extractPathParams(path);
    expect(result).toEqual(["userId", "roleId"]);
  });

  it("should handle an empty path string", () => {
    const path = "";
    const result = extractPathParams(path);
    expect(result).toEqual([]);
  });

  it("should handle a path with consecutive colons", () => {
    const path = "/user/::userId/role/:roleId";
    const result = extractPathParams(path);
    expect(result).toEqual(["roleId"]);
  });
});
