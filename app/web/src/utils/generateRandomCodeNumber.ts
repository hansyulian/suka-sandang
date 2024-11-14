import { generateRandomNumber, pad } from "@hyulian/common";

export function generateRandomCodeNumber() {
  return pad(generateRandomNumber(0, 1000), 4, { char: "0" });
}
