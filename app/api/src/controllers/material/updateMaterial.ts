import { updateMaterialContract } from "@app/common";
import { contractController } from "@hyulian/express-api-contract";

export const updateMaterialController = contractController(
  updateMaterialContract,
  async ({ params, body, locals }) => {
    const { engine } = locals;
    const { id } = params;
    const { code, name, purchasePrice, retailPrice, color, status } = body;
    const result = await engine.material.update(id, {
      code,
      name,
      purchasePrice,
      retailPrice,
      color,
      status,
    });
    return result;
  }
);
