import { getCustomerContract } from "@app/common";
import { contractController } from "@hyulian/express-api-contract";

export const getCustomerController = contractController(
  getCustomerContract,
  async ({ params, locals }) => {
    const { engine } = locals;
    const { id } = params;
    const record = await engine.customer.findById(id);
    if (record) {
      return record;
    }
    return record;
  }
);