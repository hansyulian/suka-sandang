import {
  deleteInventoryFlowContract,
  simpleSuccessResponse,
} from "@app/common";
import { contractController } from "@hyulian/express-api-contract";

export const deleteInventoryFlowController = contractController(
  deleteInventoryFlowContract,
  async ({ params, locals }) => {
    const engine = locals.engine;
    const { id } = params;
    await engine.inventoryFlow.delete(id);
    return simpleSuccessResponse;
  }
);
