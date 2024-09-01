import { SchemaType } from "@hyulian/api-contract";

export const paginationQuery = {
  offset: { type: "number", optional: true } as const,
  limit: { type: "number", optional: true } as const,
  orderBy: { type: "string", optional: true } as const,
  orderDirection: {
    type: "enum",
    values: ["asc", "desc"],
    optional: true,
  } as const,
};
export type PaginationQuery = SchemaType<typeof paginationQuery>;
