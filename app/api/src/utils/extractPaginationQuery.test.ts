import { PaginationQuery } from "@app/common"; // Adjust the import path
import { extractPaginationQuery } from "~/utils";

describe("extractPaginationQuery", () => {
  it("should return all properties when all are provided", () => {
    const query: PaginationQuery = {
      limit: 10,
      offset: 20,
      orderBy: "name",
      orderDirection: "asc",
    };

    const result = extractPaginationQuery(query);

    expect(result).toEqual({
      limit: 10,
      offset: 20,
      orderBy: "name",
      orderDirection: "asc",
    });
  });

  it("should return undefined for missing properties", () => {
    const query: PaginationQuery = {
      limit: 10,
      offset: 20,
    } as any;

    const result = extractPaginationQuery(query);

    expect(result).toEqual({
      limit: 10,
      offset: 20,
      orderBy: undefined,
      orderDirection: undefined,
    });
  });

  it("should handle an empty query object", () => {
    const query: PaginationQuery = {} as any;

    const result = extractPaginationQuery(query);

    expect(result).toEqual({
      limit: undefined,
      offset: undefined,
      orderBy: undefined,
      orderDirection: undefined,
    });
  });

  it("should return all while filtering stray values", () => {
    const query: PaginationQuery = {
      limit: 10,
      offset: 20,
      orderBy: "name",
      orderDirection: "asc",
    };

    const result = extractPaginationQuery({
      ...query,
      a: "stray value",
      b: "stray value",
    } as any);

    expect(result).toEqual({
      limit: 10,
      offset: 20,
      orderBy: "name",
      orderDirection: "asc",
    });
  });
  it("should handle empty", () => {
    const query: Partial<PaginationQuery> = {};

    const result = extractPaginationQuery({
      ...query,
      a: "stray value",
      b: "stray value",
    } as any);

    expect(result).toEqual({
      limit: undefined,
      offset: undefined,
      orderBy: undefined,
      orderDirection: undefined,
    });
  });
});
