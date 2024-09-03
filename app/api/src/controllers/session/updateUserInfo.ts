import { updateUserInfoContract } from "@app/common";
import { SessionFacade } from "@app/engine";
import { contractController } from "@hyulian/express-api-contract";

export const updateUserInfoController = contractController(
  updateUserInfoContract,
  async ({ body, locals }) => {
    const { user } = locals;
    const { name } = body;
    const result = await SessionFacade.updateUserInfo(user.id, { name });
    return result;
  }
);
