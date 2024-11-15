import { getPurchaseOrderContract } from "@app/common";
import { contractController } from "@hyulian/express-api-contract";

export const getPurchaseOrderController = contractController(
  getPurchaseOrderContract,
  async ({ params, engine }) => {
    const { idOrCode } = params;
    const record = await engine.purchaseOrder.findByIdOrCode(idOrCode);

    return record;
  }
);
