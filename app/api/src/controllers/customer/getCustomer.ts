import { getCustomerContract } from "@app/common";
import { contractController } from "@hyulian/express-api-contract";

export const getCustomerController = contractController(
  getCustomerContract,
  async ({ params, engine }) => {
    const { id } = params;
    const record = await engine.customer.findById(id);

    return record;
  }
);
