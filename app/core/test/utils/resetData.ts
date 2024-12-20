import { TruncateOptions } from "sequelize";
import { ModelCtor } from "sequelize-typescript";
import {
  Customer,
  Enum,
  Inventory,
  InventoryFlow,
  Material,
  PurchaseOrder,
  PurchaseOrderItem,
  SalesOrder,
  SalesOrderItem,
  Supplier,
  User,
} from "~/models";

const models: ModelCtor[] = [
  InventoryFlow,
  PurchaseOrderItem,
  PurchaseOrder,
  SalesOrderItem,
  SalesOrder,
  Inventory,
  Enum,
  Material,
  Customer,
  Supplier,
  User,
];
const config: TruncateOptions = {
  force: true,
  cascade: true,
};

export async function resetData(truncateModels: ModelCtor[] = models) {
  for (const model of truncateModels) {
    await model.truncate(config);
  }
}
