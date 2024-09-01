import { getMaterialContract } from "@app/common";
import { MaterialFacade } from "@app/engine";
import { contractController } from "@hyulian/express-api-contract";

export const getMaterialController = contractController(
  getMaterialContract,
  async ({ params }) => {
    const { id } = params;
    const result = await MaterialFacade.findById(id);
    return result;
  }
);
