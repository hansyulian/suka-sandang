import { updatePurchaseOrderContract } from "@app/common";
import { contractController } from "@hyulian/express-api-contract";

export const updatePurchaseOrderController = contractController(
  updatePurchaseOrderContract,
  async ({ params, body, locals }) => {
    const { engine } = locals;
    const { id } = params;
    const { date, remarks, status } = body;
    const result = await engine.purchaseOrder.update(id, {
      date,
      remarks,
      status,
    });
    return result;
  }
);
