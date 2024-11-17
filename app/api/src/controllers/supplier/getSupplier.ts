import { getSupplierContract } from "@app/common";
import { contractController } from "@hyulian/express-api-contract";

export const getSupplierController = contractController(
  getSupplierContract,
  async ({ params, engine }) => {
    const { id } = params;
    const record = await engine.supplier.findById(id);

    return record;
  }
);
