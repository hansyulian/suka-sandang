import { updateSalesOrderItemContract } from "@app/common";
import { contractController } from "@hyulian/express-api-contract";

export const updateSalesOrderItemController = contractController(
  updateSalesOrderItemContract,
  async ({ params, body, engine }) => {
    const { id } = params;
    const { remarks, materialId, quantity, unitPrice } = body;
    const result = await engine.salesOrderItem.update(id, {
      materialId,
      quantity,
      unitPrice,
      remarks,
    });
    return result;
  }
);
