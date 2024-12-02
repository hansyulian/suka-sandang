import { listSalesOrderItemsContract } from "@app/common";
import { contractController } from "@hyulian/express-api-contract";
import { extractQueryParameters } from "~/utils/extractQueryParemeters";

export const listSalesOrderItemsController = contractController(
  listSalesOrderItemsContract,
  async ({ query, engine }) => {
    const { salesOrderId } = query;
    const result = await engine.salesOrderItem.list(
      { salesOrderId },
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
