import { PurchaseOrderStatus } from "@app/common";
import { dateStringUtil } from "@hyulian/api-contract";
import { PurchaseOrder, PurchaseOrderItem } from "~/models";
import { idGenerator } from "~test/utils/idGenerator";

export async function purchaseOrderFixtures() {
  const promises = [];
  const now = dateStringUtil.toDateString(new Date());
  for (let i = 0; i < 50; i += 1) {
    promises.push(
      PurchaseOrder.create({
        id: idGenerator.purchaseOrder(i),
        code: `PO-${i}`,
        date: now,
        supplierId: idGenerator.supplier(i % 5),
        status: ["draft", "completed", "processing", "cancelled"][
          i % 4
        ] as PurchaseOrderStatus,
        remarks: `remarks ${i}`,
      })
    );
    for (let j = 0; j < 5; j += 1) {
      promises.push(
        PurchaseOrderItem.create({
          id: idGenerator.purchaseOrderItem(j, i),
          materialId: idGenerator.material(j),
          purchaseOrderId: idGenerator.purchaseOrder(i),
          quantity: 20,
          unitPrice: 50,
        })
      );
    }
  }
  await Promise.all(promises);
}
