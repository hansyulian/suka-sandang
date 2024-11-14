import { createInventoryFlowContract } from "@app/common";
import { contractController } from "@hyulian/express-api-contract";

export const createInventoryFlowController = contractController(
  createInventoryFlowContract,
  async ({ body, locals }) => {
    const { engine } = locals;
    const { inventoryId, quantity, activity, remarks } = body;
    const result = await engine.inventoryFlow.create({
      inventoryId,
      quantity,
      activity,

      remarks,
    });
    return result;
  }
);
