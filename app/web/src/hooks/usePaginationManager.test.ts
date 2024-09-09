import { renderHook, act } from "@testing-library/react-hooks";
import { usePaginationManager } from "./usePaginationManager"; // Assuming your hook is in this file

describe("usePaginationManager Hook", () => {
  const defaultLimit = 20;
  const defaultOffset = 0;

  it("should initialize with default values if no initial state is provided", () => {
    const { result } = renderHook(() => usePaginationManager({}));

    expect(result.current.value.limit).toBe(defaultLimit);
    expect(result.current.value.offset).toBe(defaultOffset);
  });

  it("should initialize with provided limit and offset from initial state", () => {
    const { result } = renderHook(() =>
      usePaginationManager({ limit: 10, offset: 5 })
    );

    expect(result.current.value.limit).toBe(10);
    expect(result.current.value.offset).toBe(5);
  });

  it("should update limit when setLimit is called", () => {
    const { result } = renderHook(() => usePaginationManager({}));

    act(() => {
      result.current.set.limit(50);
    });

    expect(result.current.value.limit).toBe(50);
  });

  it("should update offset when setOffset is called", () => {
    const { result } = renderHook(() => usePaginationManager({}));

    act(() => {
      result.current.set.offset(15);
    });

    expect(result.current.value.offset).toBe(15);
  });

  it("should update limit when initialState.limit changes", () => {
    const { result, rerender } = renderHook(
      ({ initialState }) => usePaginationManager(initialState),
      {
        initialProps: { initialState: { limit: 30 } },
      }
    );

    expect(result.current.value.limit).toBe(30);

    rerender({ initialState: { limit: 40 } });

    expect(result.current.value.limit).toBe(40);
  });

  it("should update offset when initialState.offset changes", () => {
    const { result, rerender } = renderHook(
      ({ initialState }) => usePaginationManager(initialState),
      {
        initialProps: { initialState: { offset: 10 } },
      }
    );

    expect(result.current.value.offset).toBe(10);

    rerender({ initialState: { offset: 20 } });

    expect(result.current.value.offset).toBe(20);
  });
});
