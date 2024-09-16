import { listMaterialsContract } from "@app/common";
import { MaterialFacade } from "@app/engine";
import { contractController } from "@hyulian/express-api-contract";
import { extractPaginationQuery } from "~/utils/extractPaginationQuery";
import { generateStringLikeQuery } from "~/utils/generateStringLikeQuery";

export const listMaterialsController = contractController(
  listMaterialsContract,
  async ({ query }) => {
    const { code, name } = query;
    const result = await MaterialFacade.list(
      generateStringLikeQuery({
        code,
        name,
      }),
      extractPaginationQuery(query)
    );
    return {
      info: {
        count: result.count,
      },
      records: result.records,
    };
  }
);
