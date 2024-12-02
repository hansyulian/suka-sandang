import { listSalesOrdersContract } from "@app/common";
import { Customer } from "@app/core";
import { contractController } from "@hyulian/express-api-contract";
import { extractQueryParameters } from "~/utils/extractQueryParemeters";
import { generateStringLikeQuery } from "~/utils/generateStringLikeQuery";

export const listSalesOrdersController = contractController(
  listSalesOrdersContract,
  async ({ query, engine }) => {
    const { code, search } = query;
    const processedQueryParameters = extractQueryParameters(query);
    if (query.orderBy === "customer") {
      processedQueryParameters.order = [
        [
          { model: Customer, as: "customer" },
          "name",
          query.orderDirection || "asc",
        ],
      ];
    }
    const result = await engine.salesOrder.list(
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
