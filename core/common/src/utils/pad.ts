export type PadOptions = {
  align?: 'left' | 'right';
  char?: string;
};
export function pad(
  input: string,
  length: number,
  options: PadOptions = {},
): string {
  const { align = 'right', char = ' ' } = options;
  if (char.length !== 1) {
    throw new Error('Padding character must be a single character.');
  }

  if (input.length >= length) {
    return input;
  }

  const padding = char.repeat(length - input.length);

  if (align === 'right') {
    return padding + input;
  }
  return input + padding;
}
