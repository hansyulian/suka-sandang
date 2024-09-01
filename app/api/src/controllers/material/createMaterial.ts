import { createMaterialContract } from "@app/common";
import { MaterialFacade } from "@app/engine";
import { contractController } from "@hyulian/express-api-contract";

export const createMaterialController = contractController(
  createMaterialContract,
  async (context) => {
    const { body } = context;
    const { code, name, purchasePrice, retailPrice } = body;
    const result = await MaterialFacade.create({
      code,
      name,
      purchasePrice,
      retailPrice,
    });
    return result;
  }
);
