import { apiContractSchema } from "@hyulian/api-contract";

import { createAtlasInstanceContext } from "./createAtlasInstanceContext";
import { createRegisterContractMiddleware } from "./createRegisterContractMiddleware";

describe("@base/atlas.createRegisterContractMiddleware", () => {
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
    const registerMiddleware = createRegisterContractMiddleware(
      sampleApiContract,
      context
    );
    registerMiddleware(async ({ body, params, query }) => {
      // these are to check the type strictness of the context
      // params.numberParam.toFixed() // error, should be string
      // params.stringParam.toFixed() // error, should be string
      // params.nonexistentparam // error, non exist
      // body.booleanBody.toFixed() // is boolean
      // body.numberBody.toPrecision() // is number
      // body.stringBody.toLocaleLowerCase() // is string
    });
    expect(context.middlewares.length).toStrictEqual(1);
    expect(context.middlewares[0].method).toStrictEqual("get");
    expect(context.middlewares[0].path).toStrictEqual(
      "some/{stringParam}/sample/{numberParam}"
    );
  });
});
