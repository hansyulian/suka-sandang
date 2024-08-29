import { getUserInfoContract } from "@app/common";
import { SessionFacade } from "@app/engine";
import { contractController } from "@hyulian/express-api-contract";

export const getUserInfoController = contractController(
  getUserInfoContract,
  async function getUserProfile({ locals }) {
    const result = await SessionFacade.getUserProfile(locals.userId);
    return result;
  }
);
