import dayjs from "dayjs";

import { Brand } from "./Brand";

export type DateString = Brand<string, "DateString">;
export type DateStringConvert<
  Object,
  ResultType = Date | string | DateString
> = {
  [K in keyof Object]: Object[K] extends DateString ? ResultType : Object[K];
};

export const dateStringUtil = {
  isValid,
  toDateString,
  toDate,
};

function isValid(value: DateString | string) {
  return dayjs(value).isValid();
}

function toDateString(date: Date): DateString {
  const result = new Date(date).toISOString() as DateString;
  return result;
}

function toDate(value: DateString): Date | undefined {
  if (!isValid(value)) {
    return undefined;
  }
  return new Date(value);
}
