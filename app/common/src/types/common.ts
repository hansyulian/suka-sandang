export const orderDirections = ["asc", "desc"] as const;
export type OrderDirections = (typeof orderDirections)[number];
