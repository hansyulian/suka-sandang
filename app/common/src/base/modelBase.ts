import { SchemaType } from "@hyulian/api-contract";

export const modelBase = {
  id: { type: "string" },
  createdAt: { type: "dateString" },
  updatedAt: { type: "dateString" },
  deletedAt: { type: "dateString", optional: true },
} as const;

export type ModelBase = SchemaType<typeof modelBase>;
