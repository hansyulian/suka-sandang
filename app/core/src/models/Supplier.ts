import type {
  SupplierAttributes,
  SupplierCreationAttributes,
  SupplierStatus,
} from "@app/common";
import { Column, Table } from "sequelize-typescript";
import { BaseModel, SequelizeCreationPreset } from "~/models/BaseModel";

export type SupplierSequelizeCreationAttributes =
  SequelizeCreationPreset<SupplierCreationAttributes>;
@Table({
  paranoid: true,
})
export class Supplier extends BaseModel<
  SupplierAttributes,
  SupplierSequelizeCreationAttributes
> {
  @Column
  declare name: string;

  @Column
  declare email?: string;

  @Column
  declare address?: string;

  @Column
  declare phone?: string;
  @Column
  declare identity?: string;

  @Column
  declare status: SupplierStatus;

  @Column
  declare remarks?: string;
}
