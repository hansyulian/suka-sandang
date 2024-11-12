import { simpleSuccessResponse, syncInventoryFlowsContract } from "@app/common";
import { contractController } from "@hyulian/express-api-contract";

export const syncInventoryFlowsController = contractController(
  syncInventoryFlowsContract,
  async ({ body, locals, params }) => {
    const { engine } = locals;
    const { id } = params;
    const data = body.items.map((record) => {
      const { activity, quantity, id, remarks } = record;
      return { activity, quantity, id, remarks };
    });
    await engine.inventory.sync(id, data);
    return simpleSuccessResponse;
  }
);
