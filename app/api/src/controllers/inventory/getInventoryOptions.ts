import { getInventoryOptionsContract } from "@app/common";
import { contractController } from "@hyulian/express-api-contract";

export const getInventoryOptionsController = contractController(
  getInventoryOptionsContract,
  async ({ engine }) => {
    const result = await engine.inventory.list({ status: "active" }, {});
    return {
      records: result.records,
    };
  }
);
