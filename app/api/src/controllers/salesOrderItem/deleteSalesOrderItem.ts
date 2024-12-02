import {
  deleteSalesOrderItemContract,
  simpleSuccessResponse,
} from "@app/common";
import { contractController } from "@hyulian/express-api-contract";

export const deleteSalesOrderItemController = contractController(
  deleteSalesOrderItemContract,
  async ({ params, engine }) => {
    const { id } = params;
    await engine.salesOrderItem.delete(id);
    return simpleSuccessResponse;
  }
);
