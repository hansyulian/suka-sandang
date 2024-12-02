import { getSalesOrderContract } from "@app/common";
import { contractController } from "@hyulian/express-api-contract";

export const getSalesOrderController = contractController(
  getSalesOrderContract,
  async ({ params, engine }) => {
    const { idOrCode } = params;
    const record = await engine.salesOrder.findByIdOrCode(idOrCode);

    return record;
  }
);
