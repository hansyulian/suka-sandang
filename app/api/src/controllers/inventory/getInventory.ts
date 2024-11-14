import { getInventoryContract } from "@app/common";
import { contractController } from "@hyulian/express-api-contract";

export const getInventoryController = contractController(
  getInventoryContract,
  async ({ params, locals }) => {
    const { engine } = locals;
    const { idOrCode } = params;
    const record = await engine.inventory.findByIdOrCode(idOrCode);

    return record;
  }
);
