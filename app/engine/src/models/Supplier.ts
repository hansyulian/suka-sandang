import type {
  SupplierAttributes,
  SupplierCreationAttributes,
  SupplierStatus,
} from "@app/common";
import { Column, Table } from "sequelize-typescript";
import { BaseModel } from "~/models/BaseModel";

@Table({
  paranoid: true,
})
export class Supplier extends BaseModel<
  SupplierAttributes,
  SupplierCreationAttributes
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
  declare status: SupplierStatus;

  @Column
  declare remarks?: string;
}
