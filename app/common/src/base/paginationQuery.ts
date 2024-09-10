import { SchemaType } from "@hyulian/api-contract";

export const paginationQuery = {
  offset: { type: "number", optional: true },
  limit: { type: "number", optional: true },
  orderBy: { type: "string", optional: true },
  orderDirection: {
    type: "enum",
    values: ["asc", "desc"],
    optional: true,
  },
} as const;
export type PaginationQuery = SchemaType<typeof paginationQuery>;
