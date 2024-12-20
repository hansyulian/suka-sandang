import { getMaterialContract } from "@app/common";
import { contractController } from "@hyulian/express-api-contract";

export const getMaterialController = contractController(
  getMaterialContract,
  async ({ params, engine }) => {
    const { idOrCode } = params;
    const record = await engine.material.findByIdOrCode(idOrCode);
    return record;
  }
);
