import { Op } from "@app/core";

export function generateStringLikeQuery(query: Record<string, unknown>): any {
  const keys = Object.keys(query);
  const orValues = [];
  for (const key of keys) {
    if (query[key] !== undefined && query[key] !== null) {
      orValues.push({ [key]: { [Op.iLike]: `%${query[key]}%` } });
    }
  }
  if (orValues.length === 0) {
    return {};
  }
  return {
    [Op.or]: orValues,
  };
}
