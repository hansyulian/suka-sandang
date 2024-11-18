import { SalesOrderStatus } from "@app/common";
import { SalesOrder, SalesOrderItem } from "~/models";
import { idGenerator } from "~test/utils/idGenerator";

export async function salesOrderFixtures() {
  const promises = [];
  const now = new Date();
  for (let i = 0; i < 50; i += 1) {
    promises.push(
      SalesOrder.create({
        id: idGenerator.salesOrder(i),
        code: `PO-${i}`,
        date: now,
        customerId: idGenerator.customer(i % 5),
        status: ["draft", "completed", "processing", "cancelled"][
          i % 4
        ] as SalesOrderStatus,
        remarks: `remarks ${i}`,
      })
    );
    for (let j = 0; j < 5; j += 1) {
      promises.push(
        SalesOrderItem.create({
          id: idGenerator.salesOrderItem(j, i),
          materialId: idGenerator.material(j),
          salesOrderId: idGenerator.salesOrder(i),
          quantity: 20,
          unitPrice: 50,
        })
      );
    }
  }

  try {
    await Promise.all(promises);
  } catch (err) {
    console.log(err);
  }
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
