import { BaseAttributes, CreateOmit, UpdateOmit } from "~/types/base";

export const materialStatus = ["pending", "active", "inactive"] as const;
export type MaterialStatus = (typeof materialStatus)[number];
export type MaterialAttributes = BaseAttributes & {
  name: string;
  code: string;
  status: MaterialStatus;
  purchasePrice?: number;
  retailPrice?: number;
  color?: string;
};
export type MaterialCreationAttributes = CreateOmit<MaterialAttributes>;
export type MaterialUpdateAttributes = UpdateOmit<MaterialAttributes>;
