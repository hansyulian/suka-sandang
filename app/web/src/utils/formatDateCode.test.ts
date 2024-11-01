import dayjs from "dayjs";
import { formatDateCode } from "~/utils/formatDateCode";

describe("formatDateCode", () => {
  it("should format the current date correctly", () => {
    const now = new Date();
    const expected = dayjs(now).format("YYMMDD");

    expect(formatDateCode()).toEqual(expected);
  });

  it("should format a specific date correctly", () => {
    const date = new Date("2023-10-23");
    const expected = "231023";
    expect(formatDateCode(date)).toEqual(expected);
  });

  it("should handle leap years correctly", () => {
    const date = new Date("2020-02-29");
    const expected = "200229";
    expect(formatDateCode(date)).toEqual(expected);
  });

  it("should handle invalid dates gracefully", () => {
    const date = new Date("invalid-date-string");
    const expected = "Invalid Date";
    expect(formatDateCode(date)).toEqual(expected);
  });
});
