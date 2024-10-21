import { getSupplierOptionsContract } from "@app/common";
import { contractController } from "@hyulian/express-api-contract";
import { extractQueryParameters } from "~/utils/extractQueryParemeters";
import { generateStringLikeQuery } from "~/utils/generateStringLikeQuery";

export const getSupplierOptionsController = contractController(
  getSupplierOptionsContract,
  async ({ query, locals }) => {
    const { engine } = locals;
    const result = await engine.supplier.list(
      {
        status: "active",
      },
      {}
    );
    return {
      records: result.records,
    };
  }
);
