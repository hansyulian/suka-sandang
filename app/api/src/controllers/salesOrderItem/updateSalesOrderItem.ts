import { updateSalesOrderItemContract } from "@app/common";
import { contractController } from "@hyulian/express-api-contract";

export const updateSalesOrderItemController = contractController(
  updateSalesOrderItemContract,
  async ({ params, body, engine }) => {
    const { id } = params;
    const { remarks, inventoryId, quantity, unitPrice } = body;
    const result = await engine.salesOrderItem.update(id, {
      inventoryId,
      quantity,
      unitPrice,
      remarks,
    });
    return result;
  }
);
