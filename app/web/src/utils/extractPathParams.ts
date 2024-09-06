const regex = /(?<=:)[\w]+/g;

export function extractPathParams(path: string) {
  return path.match(regex) || [];
}
