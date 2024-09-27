import { appConfig } from "~/config";
import { SequelizePaginationOptions } from "~/types";
import { processQueryOptions } from "~/utils/processQueryOptions";

// Mock appConfig
jest.mock("~/config", () => ({
  appConfig: {
    app: {
      maximumRetrieval: 100, // Set a mock value for maximum retrieval
    },
  },
}));

describe("processQueryOptions", () => {
  it("should return the original query if limit is not provided", () => {
    const query: SequelizePaginationOptions = {
      offset: 10,
      order: [["name", "ASC"]],
    };
    const result = processQueryOptions(query);
    expect(result).toEqual(query);
  });

  it("should return the original query if limit is within bounds", () => {
    const query: SequelizePaginationOptions = {
      limit: 50,
      offset: 10,
      order: [["name", "ASC"]],
    };
    const result = processQueryOptions(query);
    expect(result).toEqual(query);
  });

  it("should cap the limit to maximumRetrieval if it exceeds the maximum", () => {
    const query: SequelizePaginationOptions = {
      limit: 150,
      offset: 10,
      order: [["name", "ASC"]],
    };
    const result = processQueryOptions(query);
    expect(result.limit).toBe(appConfig.app.maximumRetrieval);
    expect(result.offset).toBe(10); // Ensure other properties remain unchanged
    expect(result.order).toEqual([["name", "ASC"]]); // Ensure other properties remain unchanged
  });

  it("should handle empty query options", () => {
    const query: SequelizePaginationOptions = {};
    const result = processQueryOptions(query);
    expect(result).toEqual(query);
  });

  it("should not modify the query if limit equals maximumRetrieval", () => {
    const query: SequelizePaginationOptions = {
      limit: appConfig.app.maximumRetrieval,
      offset: 20,
    };
    const result = processQueryOptions(query);
    expect(result).toEqual(query);
  });
});
