import type {
  MaterialAttributes,
  MaterialCreationAttributes,
  MaterialStatus,
} from "@app/common";
import { Column, HasMany, Table } from "sequelize-typescript";
import { BaseModel } from "~/models/BaseModel";
import { Inventory } from "~/models/Inventory";

@Table({
  paranoid: true,
})
export class Material extends BaseModel<
  MaterialAttributes,
  MaterialCreationAttributes
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
