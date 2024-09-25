import { describe, it, expect } from "vitest";
import { extractPaginationQuery } from "~/utils/extractPaginationQuery";

describe("extractPaginationQuery", () => {
  it("should return correct query parameters when all inputs are valid", () => {
    const query: StringQuery = {
      offset: "10",
      limit: "20",
      orderBy: "name",
      orderDirection: "desc",
    };

    const result = extractPaginationQuery(query);

    expect(result).toEqual({
      offset: 10,
      limit: 20,
      orderBy: "name",
      orderDirection: "desc",
    });
  });

  it("should return undefined for non-numeric offset and limit", () => {
    const query: StringQuery = {
      offset: "invalid",
      limit: "NaN",
      orderBy: "name",
      orderDirection: "asc",
    };

    const result = extractPaginationQuery(query);

    expect(result).toEqual({
      offset: undefined,
      limit: undefined,
      orderBy: "name",
      orderDirection: "asc",
    });
  });

  it("should return undefined for orderBy and orderDirection if orderBy is missing", () => {
    const query: StringQuery = {
      offset: "5",
      limit: "15",
      orderDirection: "desc",
    };

    const result = extractPaginationQuery(query);

    expect(result).toEqual({
      offset: 5,
      limit: 15,
      orderBy: undefined,
      orderDirection: undefined,
    });
  });

  it('should default orderDirection to "asc" if orderDirection is not provided', () => {
    const query: StringQuery = {
      offset: "5",
      limit: "15",
      orderBy: "age",
    };

    const result = extractPaginationQuery(query);

    expect(result).toEqual({
      offset: 5,
      limit: 15,
      orderBy: "age",
      orderDirection: "asc",
    });
  });

  it("should return undefined for all fields if query is empty", () => {
    const query: StringQuery = {};

    const result = extractPaginationQuery(query);

    expect(result).toEqual({
      offset: undefined,
      limit: undefined,
      orderBy: undefined,
      orderDirection: undefined,
    });
  });
});
