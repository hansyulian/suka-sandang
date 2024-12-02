import {
  CreateOmit,
  SalesOrderAttributes,
  SalesOrderCreationAttributes,
  SalesOrderItemAttributes,
  SalesOrderItemCreationAttributes,
  SalesOrderStatus,
} from "@app/common";
import { SalesOrder, SalesOrderItem } from "~/models";
import { idGenerator } from "~test/utils/idGenerator";

export async function salesOrderFixtures() {
  const salesOrderParams: SalesOrderCreationAttributes[] = [];
  const salesOrderItemParams: SalesOrderItemCreationAttributes[] = [];
  const now = new Date();
  for (let i = 0; i < 50; i += 1) {
    salesOrderParams.push({
      id: idGenerator.salesOrder(i),
      code: `PO-${i}`,
      date: now,
      customerId: idGenerator.customer(i % 5),
      status: ["draft", "completed", "processing", "cancelled"][
        i % 4
      ] as SalesOrderStatus,
      remarks: `remarks ${i}`,
    });
    for (let j = 0; j < 5; j += 1) {
      salesOrderItemParams.push({
        id: idGenerator.salesOrderItem(j, i),
        inventoryId: idGenerator.inventory(j),
        salesOrderId: idGenerator.salesOrder(i),
        quantity: 10,
        unitPrice: 50,
      });
    }
  }
  await SalesOrder.bulkCreate(salesOrderParams, { individualHooks: true });
  await SalesOrderItem.bulkCreate(salesOrderItemParams, {
    individualHooks: true,
  });
  const deletedSalesOrder = await SalesOrder.create({
    id: idGenerator.salesOrder(50),
    code: `PO-51`,
    date: now,
    customerId: idGenerator.customer(0),
    status: "draft",
    remarks: "deleted purchase order",
  });
  await deletedSalesOrder.destroy();
}
