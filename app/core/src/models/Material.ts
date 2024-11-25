import type {
  MaterialAttributes,
  MaterialCreationAttributes,
  MaterialStatus,
} from "@app/common";
import { Column, HasMany, Table } from "sequelize-typescript";
import { BaseModel, SequelizeCreationPreset } from "~/models/BaseModel";
import { Inventory } from "~/models/Inventory";

export type MaterialSequelizeCreationAttributes =
  SequelizeCreationPreset<MaterialCreationAttributes>;

@Table({
  paranoid: true,
})
export class Material extends BaseModel<
  MaterialAttributes,
  MaterialSequelizeCreationAttributes
> {
  @Column
  declare name: string;

  @Column
  declare code: string;

  @Column
  declare purchasePrice?: number;

  @Column
  declare retailPrice?: number;

  @Column
  declare color?: string;

  @Column({
    defaultValue: "active",
  })
  declare status: MaterialStatus;

  @HasMany(() => Inventory, "materialId")
  declare inventories: Inventory[];
}
