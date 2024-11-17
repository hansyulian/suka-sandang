import { getInventoryFlowContract } from "@app/common";
import { contractController } from "@hyulian/express-api-contract";

export const getInventoryFlowController = contractController(
  getInventoryFlowContract,
  async ({ params, engine }) => {
    const { id } = params;
    const record = await engine.inventoryFlow.findById(id);

    return record;
  }
);
