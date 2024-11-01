import dayjs from "dayjs";

export function formatDate(value: Date) {
  return dayjs(value).format("YYYY-MM-DD");
}
