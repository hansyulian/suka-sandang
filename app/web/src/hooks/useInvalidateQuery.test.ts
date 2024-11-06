// useInvalidateQuery.test.ts
import { renderHook } from "@testing-library/react-hooks";
import { vi, Mock } from "vitest";
import { useQueryClient } from "@tanstack/react-query";
import { useInvalidateQuery } from "./useInvalidateQuery";

vi.mock("@tanstack/react-query", () => ({
  useQueryClient: vi.fn(),
}));

describe("useInvalidateQuery", () => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let queryClientMock: any;

  beforeEach(() => {
    queryClientMock = {
      invalidateQueries: vi.fn(),
    };
    (useQueryClient as Mock).mockReturnValue(queryClientMock);
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it("should call invalidateQueries with the queryKey only when singleParams is not provided", () => {
    const { result } = renderHook(() => useInvalidateQuery());
    const invalidateQuery = result.current;

    invalidateQuery("material");

    expect(queryClientMock.invalidateQueries).toHaveBeenCalledTimes(1);
    expect(queryClientMock.invalidateQueries).toHaveBeenCalledWith({
      queryKey: ["material"],
      type: "all",
    });
  });

  it("should call invalidateQueries twice when singleParams is provided", () => {
    const { result } = renderHook(() => useInvalidateQuery());
    const invalidateQuery = result.current;
    const singleParams = { id: 1 };

    invalidateQuery("material", singleParams);

    expect(queryClientMock.invalidateQueries).toHaveBeenCalledTimes(2);
    expect(queryClientMock.invalidateQueries).toHaveBeenCalledWith({
      queryKey: ["material"],
      type: "all",
    });
    expect(queryClientMock.invalidateQueries).toHaveBeenCalledWith({
      queryKey: [singleParams, "material"],
      type: "active",
    });
  });

  it("should return an array of promises", () => {
    const { result } = renderHook(() => useInvalidateQuery());
    const invalidateQuery = result.current;

    queryClientMock.invalidateQueries.mockReturnValueOnce(Promise.resolve());
    queryClientMock.invalidateQueries.mockReturnValueOnce(Promise.resolve());

    const promises = invalidateQuery("material", { id: 1 });
    expect(promises).toHaveLength(2);
    promises.forEach((promise) => expect(promise).toBeInstanceOf(Promise));
  });
});
