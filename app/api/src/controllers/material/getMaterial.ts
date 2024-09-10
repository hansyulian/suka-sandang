import { getMaterialContract } from "@app/common";
import { MaterialFacade } from "@app/engine";
import { contractController } from "@hyulian/express-api-contract";

export const getMaterialController = contractController(
  getMaterialContract,
  async ({ params }) => {
    const { idOrCode } = params;
    const record = await MaterialFacade.findByIdOrCode(idOrCode);
    if (record) {
      return record;
    }
    return record;
  }
);
