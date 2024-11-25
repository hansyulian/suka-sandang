import type { EnumAttributes, EnumCreationAttributes } from "@app/common";
import { Column, Table } from "sequelize-typescript";
import { BaseModel, SequelizeCreationPreset } from "~/models/BaseModel";

export type EnumSequelizeCreationAttributes =
  SequelizeCreationPreset<EnumCreationAttributes>;

@Table({
  paranoid: false,
})
export class Enum extends BaseModel<
  EnumAttributes,
  EnumSequelizeCreationAttributes
> {
  @Column
  declare value: string;

  @Column
  declare group: string;

  @Column
  declare label: string;
}
