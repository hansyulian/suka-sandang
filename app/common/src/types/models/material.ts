import { Optional } from "@hyulian/common";
import { BaseAttributes, CreateOmit, UpdateOmit } from "~/types/models/base";

export const materialStatus = [
  "pending",
  "active",
  "inactive",
  "deleted",
] as const;
export type MaterialStatus = (typeof materialStatus)[number];
export type MaterialAttributes = BaseAttributes & {
  name: string;
  code: string;
  status: MaterialStatus;
  purchasePrice?: number;
  retailPrice?: number;
  color?: string;
};
export type MaterialCreationAttributes = CreateOmit<
  Optional<MaterialAttributes, "status">
>;
export type MaterialUpdateAttributes = UpdateOmit<MaterialAttributes>;
