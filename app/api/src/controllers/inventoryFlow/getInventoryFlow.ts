import { getInventoryFlowContract } from "@app/common";
import { contractController } from "@hyulian/express-api-contract";

export const getInventoryFlowController = contractController(
  getInventoryFlowContract,
  async ({ params, locals }) => {
    const { engine } = locals;
    const { id } = params;
    const record = await engine.inventoryFlow.findById(id);

    return record;
  }
);
