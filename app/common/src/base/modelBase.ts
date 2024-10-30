import { apiContractModelSchema, SchemaType } from "@hyulian/api-contract";

export const modelBase = apiContractModelSchema({
  id: { type: "string" },
  createdAt: { type: "date" },
  updatedAt: { type: "date" },
  deletedAt: { type: "date", optional: true },
});

export type ModelBase = SchemaType<typeof modelBase>;
