import { updateSupplierContract } from "@app/common";
import { contractController } from "@hyulian/express-api-contract";

export const updateSupplierController = contractController(
  updateSupplierContract,
  async ({ params, body, engine }) => {
    const { id } = params;
    const { address, identity, email, name, phone, remarks, status } = body;
    const result = await engine.supplier.update(id, {
      address,
      email,
      name,
      phone,
      remarks,
      status,
      identity,
    });
    return result;
  }
);
