import { updateCustomerContract } from "@app/common";
import { contractController } from "@hyulian/express-api-contract";

export const updateCustomerController = contractController(
  updateCustomerContract,
  async ({ params, body, locals }) => {
    const { engine } = locals;
    const { id } = params;
    const { address, identity, email, name, phone, remarks, status } = body;
    const result = await engine.customer.update(id, {
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
