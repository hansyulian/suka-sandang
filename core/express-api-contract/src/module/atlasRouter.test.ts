import { apiContractSchema } from "@hyulian/api-contract";
import { atlasRouter } from "./atlasRouter";
import { contractController } from "./contractController";
import { createAtlasInstanceContext } from "./createAtlasInstanceContext";

describe("@base/express.atlas.atlasRouter", () => {
  it("should be able to create instance and handle correctly", () => {
    const context = createAtlasInstanceContext();
    const router = atlasRouter("/base/url", context, {
      params: { rootParam: { type: "string" } },
    });

    // test contract
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

    router.controller(
      contractController(sampleApiContract, async () => {
        return {
          modelNumber: 123,
          modelString: "321",
        };
      })
    );
    expect(context.contracts.length).toStrictEqual(1);
    expect(context.contracts[0].contract).toStrictEqual(sampleApiContract);

    router.middleware(({ params }) => {
      params.rootParam;
    });
    expect(context.middlewares.length).toStrictEqual(1);
    expect(context.middlewares.at(-1)?.method).toStrictEqual("all");
    expect(context.middlewares.at(-1)?.path).toStrictEqual("base/url");

    const testSubRouter = router.router("subpath", (router) => {
      // subrouter's middleware
      router.middleware(({ params }) => {});
      expect(context.middlewares.length).toStrictEqual(2);
      expect(context.middlewares.at(-1)?.method).toStrictEqual("all");
      expect(context.middlewares.at(-1)?.path).toStrictEqual(
        "base/url/subpath"
      );

      router.router(
        "{routerParam}",
        (router) => {
          router.middleware(({ params }) => {
            params.routerParam;
          });
        },
        {
          params: {
            routerParam: {
              type: "string",
            },
          },
        }
      );
    });
    testSubRouter.middleware(({ params }) => {});
  });
});
