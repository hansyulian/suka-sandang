import { deleteCustomerContract, simpleSuccessResponse } from "@app/common";
import { contractController } from "@hyulian/express-api-contract";

export const deleteCustomerController = contractController(
  deleteCustomerContract,
  async ({ params, engine }) => {
    const { id } = params;
    await engine.customer.delete(id);
    return simpleSuccessResponse;
  }
);
