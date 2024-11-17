export type PadOptions = {
  align?: "left" | "right";
  char?: string;
};
export function pad(
  input: string | number,
  length: number,
  options: PadOptions = {}
): string {
  const { align = "right", char = " " } = options;
  const stringValue = `${input}`;
  if (char.length !== 1) {
    throw new Error("Padding character must be a single character.");
  }

  if (stringValue.length >= length) {
    return stringValue;
  }

  const padding = char.repeat(length - stringValue.length);

  if (align === "right") {
    return padding + stringValue;
  }
  return stringValue + padding;
}
