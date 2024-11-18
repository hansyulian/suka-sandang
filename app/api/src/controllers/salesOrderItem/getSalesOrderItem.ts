import { getSalesOrderItemContract } from "@app/common";
import { contractController } from "@hyulian/express-api-contract";

export const getSalesOrderItemController = contractController(
  getSalesOrderItemContract,
  async ({ params, engine }) => {
    const { id } = params;
    const record = await engine.salesOrderItem.findById(id);

    return record;
  }
);
