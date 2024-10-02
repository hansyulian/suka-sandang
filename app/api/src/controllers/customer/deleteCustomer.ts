import { deleteCustomerContract, simpleSuccessResponse } from "@app/common";
import { contractController } from "@hyulian/express-api-contract";

export const deleteCustomerController = contractController(
  deleteCustomerContract,
  async ({ params, locals }) => {
    const engine = locals.engine;
    const { id } = params;
    await engine.customer.delete(id);
    return simpleSuccessResponse;
  }
);
