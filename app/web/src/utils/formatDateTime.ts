import dayjs from "dayjs";

export function formatDateTime(value: Date) {
  return dayjs(value).format("YYYY-MM-DD HH:mm");
}
