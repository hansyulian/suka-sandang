import { listMaterialsContract } from "@app/common";
import { contractController } from "@hyulian/express-api-contract";
import { extractQueryParameters } from "~/utils/extractQueryParemeters";
import { generateStringLikeQuery } from "~/utils/generateStringLikeQuery";

export const listMaterialsController = contractController(
  listMaterialsContract,
  async ({ query, engine }) => {
    const { code, name, search } = query;
    const result = await engine.material.list(
      generateStringLikeQuery({
        code: code || search,
        name: name || search,
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
