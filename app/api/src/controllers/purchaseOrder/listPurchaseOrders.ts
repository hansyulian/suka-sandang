import { listPurchaseOrdersContract } from "@app/common";
import { contractController } from "@hyulian/express-api-contract";
import { extractQueryParameters } from "~/utils/extractQueryParemeters";
import { generateStringLikeQuery } from "~/utils/generateStringLikeQuery";

export const listPurchaseOrdersController = contractController(
  listPurchaseOrdersContract,
  async ({ query, locals }) => {
    const { engine } = locals;
    const { code, search } = query;
    const result = await engine.purchaseOrder.list(
      generateStringLikeQuery({
        code: code || search,
      }),
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
