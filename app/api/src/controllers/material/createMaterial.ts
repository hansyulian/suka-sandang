import { createMaterialContract } from "@app/common";
import { contractController } from "@hyulian/express-api-contract";

export const createMaterialController = contractController(
  createMaterialContract,
  async ({ body, engine }) => {
    const { code, name, purchasePrice, retailPrice, color, status } = body;
    const result = await engine.material.create({
      code,
      name,
      purchasePrice,
      retailPrice,
      status: status || "draft",
      color,
    });
    return result;
  }
);
