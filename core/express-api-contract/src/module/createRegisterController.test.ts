import { apiContractSchema } from "@hyulian/api-contract";

import { contractController } from "./contractController";
import { createAtlasInstanceContext } from "./createAtlasInstanceContext";
import { createRegisterController } from "./createRegisterController";

describe("@base/atlas.createRegisterController", () => {
  it("Should be able to strict typing based on the api contract", () => {
    const sampleApiContract = apiContractSchema({
      method: "get",
      path: "some/{stringParam}/sample/{numberParam}",
      params: {
        numberParam: { type: "number" },
        stringParam: { type: "string" },
      },
      query: {
        stringQuery: { type: "string" },
      },
      responseType: "object",
      model: {
        modelString: { type: "string" },
        modelNumber: { type: "number" },
      },
    });
    const context = createAtlasInstanceContext();
    const registerController = createRegisterController("", context);
    const contractReturn = registerController(
      contractController(sampleApiContract, async ({ params, query }) => {
        const testNumberParams = params.numberParam.toFixed();
        const testStringParams = params.stringParam.toLowerCase();
        const testStringQuery = query.stringQuery.toLowerCase();
        return {
          modelNumber: params.numberParam,
          modelString: `${testNumberParams} ${testStringParams} ${testStringQuery}`,
        };
        // these are to check the type strictness of the context
        // params.numberParam.toFixed() // error, should be string
        // params.stringParam.toFixed() // error, should be string
        // params.nonexistentparam // error, non exist
        // body.booleanBody.toFixed() // is boolean
        // body.numberBody.toPrecision() // is number
        // body.stringBody.toLocaleLowerCase() // is string
      })
    );
    contractReturn.middleware(async function ({ body, query, params, locals }) {
      const testNumberParams = params.numberParam.toFixed();
      const testStringParams = params.stringParam.toLowerCase();
      const testStringQuery = query.stringQuery.toLowerCase();
    });
    expect(context.contracts.length).toStrictEqual(1);
    expect(context.contracts[0].contract).toStrictEqual(sampleApiContract);
    expect(context.contracts[0].controller).toBeDefined();
    expect(context.middlewares.length).toStrictEqual(1);
    expect(context.middlewares[0].method).toStrictEqual("get");
    expect(context.middlewares[0].path).toStrictEqual(
      "some/:stringParam/sample/:numberParam"
    );
  });
});
