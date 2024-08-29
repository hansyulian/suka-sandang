import { Optional } from "sequelize";
import { Column, Table } from "sequelize-typescript";

import { BaseAttributes, BaseModel } from "./BaseModel";

export type MaterialStatus = "pending" | "active" | "inactive" | "deleted";
export type MaterialAttributes = BaseAttributes & {
  name: string;
  code: string;
  status: MaterialStatus;
  procurementPrice?: number;
  salePrice?: number;
  deletedAt?: Date;
};
export type MaterialCreationAttributes = Optional<MaterialAttributes, "id">;

@Table
export class Material extends BaseModel<
  MaterialAttributes,
  MaterialCreationAttributes
> {
  @Column
  declare name: string;

  @Column
  declare code: string;

  @Column
  declare procurementPrice?: number;

  @Column
  declare salePrice?: number;

  @Column({
    defaultValue: "active",
  })
  declare status: MaterialStatus;

  @Column
  declare deletedAt: Date;
}
