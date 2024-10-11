import { getPurchaseOrderContract } from "@app/common";
import { contractController } from "@hyulian/express-api-contract";

export const getPurchaseOrderController = contractController(
  getPurchaseOrderContract,
  async ({ params, locals }) => {
    const { engine } = locals;
    const { idOrCode } = params;
    const record = await engine.purchaseOrder.findByIdOrCode(idOrCode);

    return record;
  }
);
