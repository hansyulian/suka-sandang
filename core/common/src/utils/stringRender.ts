import { stringReplaceAll } from './stringReplaceAll';

export function stringRender(
  template: string,
  data: Record<string, string | number>,
): string {
  const entries = Object.entries(data);
  let result = template;
  for (const entry of entries) {
    result = stringReplaceAll(result, `{${entry[0]}}`, entry[1].toString());
  }
  return result;
}
