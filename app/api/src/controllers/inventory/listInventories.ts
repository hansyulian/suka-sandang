import { listInventoriesContract } from "@app/common";
import { Material } from "@app/core";
import { contractController } from "@hyulian/express-api-contract";
import { extractQueryParameters } from "~/utils/extractQueryParemeters";
import { generateStringLikeQuery } from "~/utils/generateStringLikeQuery";

export const listInventoriesController = contractController(
  listInventoriesContract,
  async ({ query, engine }) => {
    const { code, search } = query;
    const processedQueryParameters = extractQueryParameters(query);
    if (query.orderBy === "materialName") {
      processedQueryParameters.order = [
        [
          { model: Material, as: "material" },
          "name",
          query.orderDirection || "asc",
        ],
      ];
    }
    if (query.orderBy === "materialCode") {
      processedQueryParameters.order = [
        [
          { model: Material, as: "material" },
          "code",
          query.orderDirection || "asc",
        ],
      ];
    }
    const result = await engine.inventory.list(
      generateStringLikeQuery({
        code: code || search,
      }),
      processedQueryParameters
    );
    return {
      info: {
        count: result.count,
      },
      records: result.records,
    };
  }
);
