import { deleteSalesOrderContract, simpleSuccessResponse } from "@app/common";
import { contractController } from "@hyulian/express-api-contract";

export const deleteSalesOrderController = contractController(
  deleteSalesOrderContract,
  async ({ params, engine }) => {
    const { id } = params;
    await engine.salesOrder.delete(id);
    return simpleSuccessResponse;
  }
);
