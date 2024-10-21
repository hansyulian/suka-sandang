import type { EnumAttributes, EnumCreationAttributes } from "@app/common";
import { Column, Table } from "sequelize-typescript";
import { BaseModel } from "~/models/BaseModel";

@Table({
  paranoid: false,
})
export class Enum extends BaseModel<EnumAttributes, EnumCreationAttributes> {
  @Column
  declare value: string;

  @Column
  declare group: string;

  @Column
  declare label: string;
}
