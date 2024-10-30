import { listPurchaseOrdersContract } from "@app/common";
import { Supplier } from "@app/engine";
import { contractController } from "@hyulian/express-api-contract";
import { extractQueryParameters } from "~/utils/extractQueryParemeters";
import { generateStringLikeQuery } from "~/utils/generateStringLikeQuery";

export const listPurchaseOrdersController = contractController(
  listPurchaseOrdersContract,
  async ({ query, locals }) => {
    const { engine } = locals;
    const { code, search } = query;
    const processedQueryParameters = extractQueryParameters(query);
    if (query.orderBy === "supplier") {
      processedQueryParameters.order = [
        [
          { model: Supplier, as: "supplier" },
          "name",
          query.orderDirection || "asc",
        ],
      ];
    }
    const result = await engine.purchaseOrder.list(
      generateStringLikeQuery({
        code: code || search,
      }),
      processedQueryParameters
    );
    return {
      info: {
        count: result.count,
      },
      records: result.records,
    };
  }
);
