import { BaseAttributes, CreateOmit, UpdateOmit } from "~/types/models/base";

export type EnumAttributes = BaseAttributes & {
  value: string;
  label: string;
  group: string;
};
export type EnumCreationAttributes = CreateOmit<EnumAttributes>;
export type EnumUpdateAttributes = UpdateOmit<Partial<EnumAttributes>>;
