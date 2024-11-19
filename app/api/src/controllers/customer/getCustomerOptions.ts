import { getCustomerOptionsContract } from "@app/common";
import { contractController } from "@hyulian/express-api-contract";

export const getCustomerOptionsController = contractController(
  getCustomerOptionsContract,
  async ({ query, engine }) => {
    const result = await engine.customer.list(
      {
        status: "active",
      },
      {}
    );
    return {
      records: result.records,
    };
  }
);
