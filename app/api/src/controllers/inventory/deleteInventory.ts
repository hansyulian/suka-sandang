import { deleteInventoryContract, simpleSuccessResponse } from "@app/common";
import { contractController } from "@hyulian/express-api-contract";

export const deleteInventoryController = contractController(
  deleteInventoryContract,
  async ({ params, engine }) => {
    const { id } = params;
    await engine.inventory.delete(id);
    return simpleSuccessResponse;
  }
);
