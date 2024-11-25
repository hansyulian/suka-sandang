import type {
  CustomerAttributes,
  CustomerCreationAttributes,
  CustomerStatus,
} from "@app/common";
import { Column, Table } from "sequelize-typescript";
import { BaseModel, SequelizeCreationPreset } from "~/models/BaseModel";

export type CustomerSequelizeCreationAttributes =
  SequelizeCreationPreset<CustomerCreationAttributes>;

@Table({
  paranoid: true,
})
export class Customer extends BaseModel<
  CustomerAttributes,
  CustomerSequelizeCreationAttributes
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
  declare status: CustomerStatus;

  @Column
  declare remarks?: string;
}
