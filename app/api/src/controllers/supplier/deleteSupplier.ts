import { deleteSupplierContract, simpleSuccessResponse } from "@app/common";
import { contractController } from "@hyulian/express-api-contract";

export const deleteSupplierController = contractController(
  deleteSupplierContract,
  async ({ params, engine }) => {
    const { id } = params;
    await engine.supplier.delete(id);
    return simpleSuccessResponse;
  }
);
