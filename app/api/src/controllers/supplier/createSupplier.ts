import { createSupplierContract } from "@app/common";
import { contractController } from "@hyulian/express-api-contract";

export const createSupplierController = contractController(
  createSupplierContract,
  async ({ body, locals }) => {
    const { engine } = locals;
    const { address, email, name, phone, remarks, status } = body;
    const result = await engine.supplier.create({
      address,
      email,
      name,
      phone,
      remarks,
      status,
    });
    return result;
  }
);
