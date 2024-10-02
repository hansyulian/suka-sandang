import { createCustomerContract } from "@app/common";
import { contractController } from "@hyulian/express-api-contract";

export const createCustomerController = contractController(
  createCustomerContract,
  async ({ body, locals }) => {
    const { engine } = locals;
    const { address, email, name, identity, phone, remarks, status } = body;
    const result = await engine.customer.create({
      address,
      identity,
      email,
      name,
      phone,
      remarks,
      status,
    });
    return result;
  }
);
