import { updateUserInfoContract } from "@app/common";
import { SessionFacade } from "@app/engine";
import { contractController } from "@hyulian/express-api-contract";

export const updateUserInfoController = contractController(
  updateUserInfoContract,
  async function updateUserInfo({ body, locals }) {
    const { userId} = locals;
    const { name } = body;
    const loginResult = await SessionFacade.updateUserInfo(userId, {name});
    return {
      sessionToken: loginResult.token,
    };
  }
);
