import { updateUserInfoContract } from "@app/common";
import { UserFacade } from "@app/engine";
import { contractController } from "@hyulian/express-api-contract";

export const updateUserInfoController = contractController(
  updateUserInfoContract,
  async ({ body, locals }) => {
    const { user } = locals;
    const { name } = body;
    const result = await UserFacade.update(user.id, { name });
    return result;
  }
);
