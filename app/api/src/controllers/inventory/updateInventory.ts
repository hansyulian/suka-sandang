import { updateInventoryContract } from "@app/common";
import { contractController } from "@hyulian/express-api-contract";

export const updateInventoryController = contractController(
  updateInventoryContract,
  async ({ params, body, locals }) => {
    const { engine } = locals;
    const { id } = params;
    const { remarks } = body;
    const result = await engine.inventory.update(id, {
      remarks,
    });
    return result;
  }
);
