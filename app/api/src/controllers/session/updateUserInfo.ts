import { updateUserInfoContract } from "@app/common";
import { contractController } from "@hyulian/express-api-contract";

export const updateUserInfoController = contractController(
  updateUserInfoContract,
  async ({ body, engine, locals }) => {
    const { user } = locals;
    const { name } = body;
    const result = await engine.user.update(user.id, { name });
    return result;
  }
);
