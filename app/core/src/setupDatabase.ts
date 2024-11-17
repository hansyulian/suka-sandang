import { createNamespace } from "cls-hooked";
import { Dialect } from "sequelize";
import { Sequelize, SequelizeOptions } from "sequelize-typescript";
import { appConfig } from "~/config";
import {
  User,
  Enum,
  Material,
  Supplier,
  Customer,
  PurchaseOrderItem,
  Inventory,
  InventoryFlow,
} from "~/models";
import { PurchaseOrder } from "~/models/PurchaseOrder";

const clsNamespace = createNamespace("transaction-namespace");

Sequelize.useCLS(clsNamespace);

export type DBConfig = {
  username: string;
  password: string;
  database: string;
  host: string;
  port: number;
  dialect: Dialect;
  storage?: string;
  logging?: "console";
};

export function setupDatabase(
  dbConfig: DBConfig = appConfig.database,
  sequelizeOptions: Partial<SequelizeOptions> = {}
) {
  const logging = dbConfig.logging === "console" ? console.log : () => {};
  const sequelizeConfig: SequelizeOptions = {
    username: dbConfig.username,
    password: dbConfig.password,
    database: dbConfig.database,
    host: dbConfig.host,
    port: dbConfig.port,
    dialect: dbConfig.dialect,
    storage: dbConfig.storage,
    logging,
    models: [
      User,
      Enum,
      Material,
      Supplier,
      Customer,
      PurchaseOrder,
      PurchaseOrderItem,
      Inventory,
      InventoryFlow,
    ],
    ...sequelizeOptions,
  };
  const sequelize = new Sequelize(sequelizeConfig);
  return sequelize;
}
