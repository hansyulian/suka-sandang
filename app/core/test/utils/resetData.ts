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
  Supplier,
  User,
} from "~/models";

const models: ModelCtor[] = [
  Enum,
  Material,
  Customer,
  PurchaseOrder,
  PurchaseOrderItem,
  Supplier,
  User,
  Inventory,
  InventoryFlow,
];
const config: TruncateOptions = {
  force: true,
  cascade: true,
};

export async function resetData(truncateModels: ModelCtor[] = models) {
  await Promise.all(truncateModels.map((model) => model.truncate(config)));
}
