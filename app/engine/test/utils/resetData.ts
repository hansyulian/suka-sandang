import { TruncateOptions } from "sequelize";
import {
  Customer,
  Enum,
  Material,
  PurchaseOrder,
  PurchaseOrderItem,
  Supplier,
  User,
} from "~/models";

export async function resetData() {
  const config: TruncateOptions = {
    force: true,
  };
  await Promise.all([
    User.truncate(config),
    Enum.truncate(config),
    Material.truncate(config),
    Supplier.truncate(config),
    Customer.truncate(config),
    PurchaseOrderItem.truncate(config),
    PurchaseOrder.truncate(config),
  ]);
}
