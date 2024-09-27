import { updateUserInfoContract } from "@app/common";
import { contractController } from "@hyulian/express-api-contract";

export const updateUserInfoController = contractController(
  updateUserInfoContract,
  async ({ body, locals }) => {
    const { user, engine } = locals;
    const { name } = body;
    const result = await engine.user.update(user.id, { name });
    return result;
  }
);
