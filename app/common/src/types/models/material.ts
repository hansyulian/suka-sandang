import { apiContractModelSchema, SchemaType } from "@hyulian/api-contract";
import { Optional } from "@hyulian/common";
import { BaseAttributes, CreateOmit, UpdateOmit } from "~/types/models/base";

export const materialStatus = ["draft", "active", "deleted"] as const;
export const materialFields = apiContractModelSchema({
  name: { type: "string" },
  code: { type: "string" },
  purchasePrice: { type: "number", optional: true },
  retailPrice: { type: "number", optional: true },
  color: { type: "string", optional: true },
  status: {
    type: "enum",
    values: materialStatus,
  },
});
export type MaterialFields = SchemaType<typeof materialFields>;
export type MaterialStatus = (typeof materialStatus)[number];
export type MaterialAttributes = BaseAttributes & MaterialFields;
export type MaterialCreationAttributes = CreateOmit<
  Optional<MaterialAttributes, "status">
>;
export type MaterialUpdateAttributes = UpdateOmit<MaterialAttributes>;
