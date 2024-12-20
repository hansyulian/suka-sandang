import { createInventoryContract } from "@app/common";
import { contractController } from "@hyulian/express-api-contract";

export const createInventoryController = contractController(
  createInventoryContract,
  async ({ body, engine }) => {
    const { code, materialId, remarks } = body;
    const result = await engine.inventory.create({
      code,
      remarks,
      materialId,
    });
    return result;
  }
);
