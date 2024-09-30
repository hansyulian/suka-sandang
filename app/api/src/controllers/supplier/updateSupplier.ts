import { updateSupplierContract } from "@app/common";
import { contractController } from "@hyulian/express-api-contract";

export const updateSupplierController = contractController(
  updateSupplierContract,
  async ({ params, body, locals }) => {
    const { engine } = locals;
    const { id } = params;
    const { address, email, name, phone, remarks, status } = body;
    const result = await engine.supplier.update(id, {
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
