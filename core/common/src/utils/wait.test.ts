import { wait } from "./wait";

describe("@hyulian/common.utils.wait", () => {
  it("should resolve after a given time", async () => {
    const ms = 1000; // Time to wait in milliseconds
    const startTime = Date.now();
    await wait(ms);
    const endTime = Date.now();
    const elapsedTime = endTime - startTime;
    // Allow a small margin of error (e.g., 50ms) due to potential async execution delays
    expect(elapsedTime).toBeGreaterThanOrEqual(ms - 50);
    expect(elapsedTime).toBeLessThanOrEqual(ms + 50);
  });
});
