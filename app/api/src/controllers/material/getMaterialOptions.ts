import { contractController } from "@hyulian/express-api-contract";
import { getMaterialOptionsContract } from "@app/common";

export const getMaterialOptionsController = contractController(
  getMaterialOptionsContract,
  async ({ query, locals }) => {
    const { engine } = locals;
    const result = await engine.material.list({}, {});
    return {
      records: result.records,
    };
  }
);
