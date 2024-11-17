import { createPurchaseOrderContract } from "@app/common";
import { contractController } from "@hyulian/express-api-contract";

export const createPurchaseOrderController = contractController(
  createPurchaseOrderContract,
  async ({ body, engine }) => {
    const { code, date, supplierId, remarks, status, items } = body;
    const result = await engine.purchaseOrder.create({
      code,
      date,
      supplierId,
      remarks,
      status,
      items,
    });
    return result;
  }
);
