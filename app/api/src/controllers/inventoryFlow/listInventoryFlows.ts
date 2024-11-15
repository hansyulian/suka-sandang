import { listInventoryFlowsContract } from "@app/common";
import { contractController } from "@hyulian/express-api-contract";
import { extractQueryParameters } from "~/utils/extractQueryParemeters";

export const listInventoryFlowsController = contractController(
  listInventoryFlowsContract,
  async ({ query, engine }) => {
    const { inventoryId } = query;
    const result = await engine.inventoryFlow.list(
      { inventoryId },
      extractQueryParameters(query)
    );
    return {
      info: {
        count: result.count,
      },
      records: result.records,
    };
  }
);
