import { listEnumsContract } from "@app/common";
import { contractController } from "@hyulian/express-api-contract";

export const listEnumsController = contractController(
  listEnumsContract,
  async ({ locals }) => {
    const { engine } = locals;
    const result = await engine.enum.list();
    return {
      records: result.records,
    };
  }
);
