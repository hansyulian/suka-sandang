import { listMaterialsContract } from "@app/common";
import { MaterialFacade } from "@app/engine";
import { contractController } from "@hyulian/express-api-contract";
import { extractQueryParameters } from "~/utils/extractQueryParemeters";
import { generateStringLikeQuery } from "~/utils/generateStringLikeQuery";

export const listMaterialsController = contractController(
  listMaterialsContract,
  async ({ query }) => {
    const { code, name, search } = query;
    const result = await MaterialFacade.list(
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
