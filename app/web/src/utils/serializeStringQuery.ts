/* eslint-disable @typescript-eslint/no-explicit-any */
export function serializeStringQuery(query: StringQuery) {
  const stringQuery = new URLSearchParams(query as any);
  const sq = stringQuery.toString();
  return sq.length > 0 ? `?${sq}` : "";
}
