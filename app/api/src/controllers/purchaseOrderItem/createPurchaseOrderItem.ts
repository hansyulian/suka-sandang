import { createPurchaseOrderItemContract } from "@app/common";
import { contractController } from "@hyulian/express-api-contract";

export const createPurchaseOrderItemController = contractController(
  createPurchaseOrderItemContract,
  async ({ body, locals }) => {
    const { engine } = locals;
    const { materialId, purchaseOrderId, quantity, unitPrice, remarks } = body;
    const result = await engine.purchaseOrderItem.create({
      materialId,
      purchaseOrderId,
      quantity,
      unitPrice,
      remarks,
    });
    return result;
  }
);
