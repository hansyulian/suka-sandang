import { deleteMaterialContract, simpleSuccessResponse } from "@app/common";
import { contractController } from "@hyulian/express-api-contract";

export const deleteMaterialController = contractController(
  deleteMaterialContract,
  async ({ params, engine }) => {
    const { id } = params;
    await engine.material.delete(id);
    return simpleSuccessResponse;
  }
);
