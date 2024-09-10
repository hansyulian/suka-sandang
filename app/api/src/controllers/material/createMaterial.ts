import { createMaterialContract } from "@app/common";
import { MaterialFacade } from "@app/engine";
import { contractController } from "@hyulian/express-api-contract";

export const createMaterialController = contractController(
  createMaterialContract,
  async (context) => {
    const { body } = context;
    const { code, name, purchasePrice, retailPrice, color, status } = body;
    const result = await MaterialFacade.create({
      code,
      name,
      purchasePrice,
      retailPrice,
      status: status || "pending",
      color,
    });
    return result;
  }
);
