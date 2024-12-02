import { updateSalesOrderContract } from "@app/common";
import { contractController } from "@hyulian/express-api-contract";

export const updateSalesOrderController = contractController(
  updateSalesOrderContract,
  async ({ params, body, engine }) => {
    const { id } = params;
    const { date, remarks, status, items } = body;
    const result = await engine.salesOrder.update(id, {
      date,
      remarks,
      status,
      items,
    });
    return result;
  }
);
