import { updateInventoryFlowContract } from "@app/common";
import { contractController } from "@hyulian/express-api-contract";

export const updateInventoryFlowController = contractController(
  updateInventoryFlowContract,
  async ({ params, body, locals }) => {
    const { engine } = locals;
    const { id } = params;
    const { activity, quantity, remarks } = body;
    const result = await engine.inventoryFlow.update(id, {
      activity,
      quantity,
      remarks,
    });
    return result;
  }
);
