import { listPurchaseOrderItemsContract } from "@app/common";
import { contractController } from "@hyulian/express-api-contract";
import { extractQueryParameters } from "~/utils/extractQueryParemeters";

export const listPurchaseOrderItemsController = contractController(
  listPurchaseOrderItemsContract,
  async ({ query, locals }) => {
    const { engine } = locals;
    const { purchaseOrderId } = query;
    const result = await engine.purchaseOrderItem.list(
      { purchaseOrderId },
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
