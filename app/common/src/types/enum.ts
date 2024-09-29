import { BaseAttributes, CreateOmit, UpdateOmit } from "~/types/base";

export type EnumAttributes = BaseAttributes & {
  value: string;
  group: string;
};
export type EnumCreationAttributes = CreateOmit<EnumAttributes>;
export type EnumUpdateAttributes = UpdateOmit<Partial<EnumAttributes>>;
