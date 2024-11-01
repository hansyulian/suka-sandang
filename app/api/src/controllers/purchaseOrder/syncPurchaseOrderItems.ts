import {
  simpleSuccessResponse,
  syncPurchaseOrderItemsContract,
} from "@app/common";
import { contractController } from "@hyulian/express-api-contract";

export const syncPurchaseOrderItemsController = contractController(
  syncPurchaseOrderItemsContract,
  async ({ body, locals, params }) => {
    const { engine } = locals;
    const { id } = params;
    const data = body.items.map((record) => {
      const { materialId, quantity, unitPrice, id, remarks } = record;
      return {
        materialId,
        quantity,
        unitPrice,
        id,
        remarks,
      };
    });
    await engine.purchaseOrder.sync(id, data);
    return simpleSuccessResponse;
  }
);
