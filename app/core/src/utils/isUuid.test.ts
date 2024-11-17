import { isUuid } from "~/utils/isUuid";

describe("Utils: isUuid", () => {
  it("should be validating correct uuid", () => {
    expect(isUuid("13761e01-f409-40f5-bb3a-f4c8c16988be")).toStrictEqual(true);
  });
  it("should reject invalid uuid", () => {
    expect(isUuid("invalid")).toStrictEqual(false);
  });
});
