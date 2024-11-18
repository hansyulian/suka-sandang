import { createSalesOrderContract } from "@app/common";
import { contractController } from "@hyulian/express-api-contract";

export const createSalesOrderController = contractController(
  createSalesOrderContract,
  async ({ body, engine }) => {
    const { code, date, customerId, remarks, status, items } = body;
    const result = await engine.salesOrder.create({
      code,
      date,
      customerId,
      remarks,
      status,
      items,
    });
    return result;
  }
);
