import dayjs from "dayjs";

export function formatDateCode(date: Date = new Date()) {
  return dayjs(date).format("YYMMDD");
}
