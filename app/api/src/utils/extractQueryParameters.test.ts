import { QueryParameters } from "@app/common"; // Adjust the import path
import { extractQueryParameters } from "~/utils";

describe("extractPaginationQuery", () => {
  it("should return all properties when all are provided", () => {
    const query: QueryParameters = {
      limit: 10,
      offset: 20,
      orderBy: "name",
      orderDirection: "asc",
    };

    const result = extractQueryParameters(query);

    expect(result).toEqual({
      limit: 10,
      offset: 20,
      order: [["name", "asc"]],
    });
  });

  it("should return undefined for missing properties", () => {
    const query: QueryParameters = {
      limit: 10,
      offset: 20,
    } as any;

    const result = extractQueryParameters(query);

    expect(result).toEqual({
      limit: 10,
      offset: 20,
      order: undefined,
    });
  });

  it("should handle an empty query object", () => {
    const query: QueryParameters = {} as any;

    const result = extractQueryParameters(query);

    expect(result).toEqual({
      limit: undefined,
      offset: undefined,
      order: undefined,
    });
  });

  it("should return all while filtering stray values", () => {
    const query: QueryParameters = {
      limit: 10,
      offset: 20,
      orderBy: "name",
      orderDirection: "asc",
    };

    const result = extractQueryParameters({
      ...query,
      a: "stray value",
      b: "stray value",
    } as any);

    expect(result).toEqual({
      limit: 10,
      offset: 20,
      order: [["name", "asc"]],
    });
  });
  it("should handle empty with stray values", () => {
    const query: QueryParameters = {};

    const result = extractQueryParameters({
      ...query,
      a: "stray value",
      b: "stray value",
    } as any);

    expect(result).toEqual({
      limit: undefined,
      offset: undefined,
      order: undefined,
    });
  });

  it("should prevent limit from exceeding defined limit", () => {
    const query: QueryParameters = { limit: 1000 };
    const result = extractQueryParameters(query);
    expect(result).toEqual({
      limit: 100,
    });
  });
});
