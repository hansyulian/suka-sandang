import { ApiContractQuerySchema } from "@hyulian/api-contract";

export const paginationQuery: ApiContractQuerySchema = {
  offset: { type: "number", optional: true },
  limit: { type: "number", optional: true },
  orderBy: { type: "string", optional: true },
  orderDirection: { type: "enum", values: ["asc", "desc"] },
};
