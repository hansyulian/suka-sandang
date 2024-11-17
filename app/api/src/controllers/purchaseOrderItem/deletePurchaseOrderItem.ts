import {
  deletePurchaseOrderItemContract,
  simpleSuccessResponse,
} from "@app/common";
import { contractController } from "@hyulian/express-api-contract";

export const deletePurchaseOrderItemController = contractController(
  deletePurchaseOrderItemContract,
  async ({ params, engine }) => {
    const { id } = params;
    await engine.purchaseOrderItem.delete(id);
    return simpleSuccessResponse;
  }
);
