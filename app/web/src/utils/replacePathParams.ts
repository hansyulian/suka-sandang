import { extractPathParams } from "~/utils/extractPathParams";

export function replacePathParams(
  path: string,
  params: Record<string, string | number | boolean>
) {
  const pathParams = extractPathParams(path);
  let result = path;
  for (const param of pathParams) {
    result = result
      .replace(`:${param}?`, `${params[param] ?? ""}`)
      .replace(`:${param}`, `${params[param]}`);
  }
  return result;
}
