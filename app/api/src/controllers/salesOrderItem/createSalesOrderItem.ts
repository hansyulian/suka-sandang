import { createSalesOrderItemContract } from "@app/common";
import { contractController } from "@hyulian/express-api-contract";

export const createSalesOrderItemController = contractController(
  createSalesOrderItemContract,
  async ({ body, engine }) => {
    const { materialId, salesOrderId, quantity, unitPrice, remarks } = body;
    const result = await engine.salesOrderItem.create({
      materialId,
      salesOrderId,
      quantity,
      unitPrice,
      remarks,
    });
    return result;
  }
);
