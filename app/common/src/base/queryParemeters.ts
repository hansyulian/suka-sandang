import { SchemaType } from "@hyulian/api-contract";
import { orderDirections } from "~/types/common";

export const queryParameters = {
  offset: { type: "number", optional: true },
  limit: { type: "number", optional: true },
  orderBy: { type: "string", optional: true },
  orderDirection: {
    type: "enum",
    values: orderDirections,
    optional: true,
  },
} as const;
export type QueryParameters = Partial<SchemaType<typeof queryParameters>>;
