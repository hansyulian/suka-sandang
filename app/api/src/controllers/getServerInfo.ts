import { getServerInfoContract } from "@app/common";
import { contractController } from "@hyulian/express-api-contract";

export const getServerInfoController = contractController(
  getServerInfoContract,
  async function getServerInfo() {
    return {
      status: "normal" as const,
    };
  }
);
