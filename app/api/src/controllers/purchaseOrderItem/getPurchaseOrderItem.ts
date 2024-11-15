import { getPurchaseOrderItemContract } from "@app/common";
import { contractController } from "@hyulian/express-api-contract";

export const getPurchaseOrderItemController = contractController(
  getPurchaseOrderItemContract,
  async ({ params, engine }) => {
    const { id } = params;
    const record = await engine.purchaseOrderItem.findById(id);

    return record;
  }
);
