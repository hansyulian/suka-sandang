import { listCustomersContract } from "@app/common";
import { contractController } from "@hyulian/express-api-contract";
import { extractQueryParameters } from "~/utils/extractQueryParemeters";
import { generateStringLikeQuery } from "~/utils/generateStringLikeQuery";

export const listCustomersController = contractController(
  listCustomersContract,
  async ({ query, engine }) => {
    const { search } = query;
    const result = await engine.customer.list(
      generateStringLikeQuery({
        name: search,
        address: search,
        phone: search,
        email: search,
        remarks: search,
      }),
      extractQueryParameters(query)
    );
    return {
      info: {
        count: result.count,
      },
      records: result.records,
    };
  }
);
