import {
  deletePurchaseOrderContract,
  simpleSuccessResponse,
} from "@app/common";
import { contractController } from "@hyulian/express-api-contract";

export const deletePurchaseOrderController = contractController(
  deletePurchaseOrderContract,
  async ({ params, engine }) => {
    const { id } = params;
    await engine.purchaseOrder.delete(id);
    return simpleSuccessResponse;
  }
);
