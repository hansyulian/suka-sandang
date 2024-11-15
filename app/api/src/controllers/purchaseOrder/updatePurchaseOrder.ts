import { updatePurchaseOrderContract } from "@app/common";
import { contractController } from "@hyulian/express-api-contract";

export const updatePurchaseOrderController = contractController(
  updatePurchaseOrderContract,
  async ({ params, body, engine }) => {
    const { id } = params;
    const { date, remarks, status, items } = body;
    const result = await engine.purchaseOrder.update(id, {
      date,
      remarks,
      status,
      items,
    });
    return result;
  }
);
