import { updatePurchaseOrderItemContract } from "@app/common";
import { contractController } from "@hyulian/express-api-contract";

export const updatePurchaseOrderItemController = contractController(
  updatePurchaseOrderItemContract,
  async ({ params, body, engine }) => {
    const { id } = params;
    const { remarks, materialId, quantity, unitPrice } = body;
    const result = await engine.purchaseOrderItem.update(id, {
      materialId,
      quantity,
      unitPrice,
      remarks,
    });
    return result;
  }
);
