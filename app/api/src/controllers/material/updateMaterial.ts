import { updateMaterialContract } from "@app/common";
import { MaterialFacade } from "@app/engine";
import { contractController } from "@hyulian/express-api-contract";

export const updateMaterialController = contractController(
  updateMaterialContract,
  async ({ params, body }) => {
    const { id } = params;
    const { code, name, purchasePrice, retailPrice } = body;
    const result = await MaterialFacade.update(id, {
      code,
      name,
      purchasePrice,
      retailPrice,
    });
    return result;
  }
);
