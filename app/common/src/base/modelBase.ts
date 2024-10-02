import { apiContractModelSchema, SchemaType } from "@hyulian/api-contract";

export const modelBase = apiContractModelSchema({
  id: { type: "string" },
  createdAt: { type: "dateString" },
  updatedAt: { type: "dateString" },
  deletedAt: { type: "dateString", optional: true },
});

export type ModelBase = SchemaType<typeof modelBase>;
