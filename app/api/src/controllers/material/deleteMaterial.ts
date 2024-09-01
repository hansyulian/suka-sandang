import { deleteMaterialContract, simpleSuccessResponse } from "@app/common";
import { MaterialFacade } from "@app/engine";
import { contractController } from "@hyulian/express-api-contract";

export const deleteMaterialController = contractController(
  deleteMaterialContract,
  async ({ params }) => {
    const { id } = params;
    await MaterialFacade.delete(id);
    return simpleSuccessResponse;
  }
);
