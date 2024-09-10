import type {
  UserAttributes,
  UserCreationAttributes,
  UserStatus,
} from "@app/common";
import { Column, Table } from "sequelize-typescript";
import { BaseModel } from "~/models/BaseModel";

@Table({
  paranoid: true,
})
export class User extends BaseModel<UserAttributes, UserCreationAttributes> {
  @Column
  declare name: string;

  @Column
  declare email: string;

  @Column
  declare password: string;

  @Column
  declare status: UserStatus;
}
