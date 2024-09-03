import { getUserInfoContract } from "@app/common";
import { SessionFacade } from "@app/engine";
import { contractController } from "@hyulian/express-api-contract";

export const getUserInfoController = contractController(
  getUserInfoContract,
  async ({ locals }) => {
    return locals.user;
  }
);
