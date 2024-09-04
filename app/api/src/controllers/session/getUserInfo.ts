import { getUserInfoContract } from "@app/common";
import { contractController } from "@hyulian/express-api-contract";

export const getUserInfoController = contractController(
  getUserInfoContract,
  async ({ locals }) => {
    return locals.user;
  }
);
