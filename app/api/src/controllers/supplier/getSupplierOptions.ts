import { getSupplierOptionsContract } from "@app/common";
import { contractController } from "@hyulian/express-api-contract";

export const getSupplierOptionsController = contractController(
  getSupplierOptionsContract,
  async ({ query, locals }) => {
    const { engine } = locals;
    const result = await engine.supplier.list(
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
