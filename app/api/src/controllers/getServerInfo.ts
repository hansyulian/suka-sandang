import { getServerInfoContract } from "@app/common";
import { UserNotFoundException } from "@app/engine";
import { contractController } from "@hyulian/express-api-contract";

export const getServerInfoController = contractController(
  getServerInfoContract,
  async () => {
    return {
      status: "normal" as const,
    };
  }
);
