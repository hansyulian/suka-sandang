import { MaterialFacade } from "@app/engine";
import { extractPaginationQuery, generateStringLikeQuery } from "~/utils";
import { apiTest, injectStrayValues } from "~test/utils";

describe("Controller: listMaterialsController", () => {
  it("should require authentication", async () => {
    await apiTest.testRequireAuthentication().get("/material");
  });
  it("should call material facade list function", async () => {
    const id = "mock-id";
    (MaterialFacade.list as jest.Mock).mockResolvedValueOnce({
      records: [
        {
          id: id,
          name: "Material 1",
          code: "material-1",
          purchasePrice: null,
          retailPrice: null,
          createdAt: new Date(),
          status: "active",
          updatedAt: new Date(),
        },
      ],
      count: 1,
    });
    const response = await apiTest.withAuthentication().get(`/material`).send();

    expect(MaterialFacade.list).toHaveBeenCalledWith(
      {},
      extractPaginationQuery({})
    );
    const { body } = response;
    expect(body.info).toEqual({ count: 1 });
    expect(body.records.length).toStrictEqual(1);
    const firstRecord = body.records[0];
    expect(firstRecord.id).toStrictEqual(id);
    expect(firstRecord.name).toStrictEqual("Material 1");
    expect(firstRecord.code).toStrictEqual("material-1");
    expect(firstRecord.purchasePrice).toStrictEqual(undefined);
    expect(firstRecord.retailPrice).toStrictEqual(undefined);
    expect(firstRecord.status).toStrictEqual("active");
    expect(firstRecord.createdAt).toBeDefined();
    expect(firstRecord.updatedAt).toBeDefined();
    expect(firstRecord.deletedAt).toBeUndefined();
  });
  it("should handle queries", async () => {
    const id = "mock-id";
    (MaterialFacade.list as jest.Mock).mockResolvedValueOnce({
      records: [
        {
          id: id,
          name: "Material 1",
          code: "material-1",
          purchasePrice: null,
          retailPrice: null,
          createdAt: new Date(),
          status: "active",
          updatedAt: new Date(),
        },
      ],
      count: 1,
    });
    const query = {
      code: "code-test",
      name: "name-test",
    };
    const response = await apiTest
      .withAuthentication()
      .get(`/material`)
      .query(injectStrayValues(query))
      .send();

    expect(MaterialFacade.list).toHaveBeenCalledWith(
      generateStringLikeQuery(query),
      extractPaginationQuery({})
    );
    const { body } = response;
    expect(body.info).toEqual({ count: 1 });
    expect(body.records.length).toStrictEqual(1);
    const firstRecord = body.records[0];
    expect(firstRecord.id).toStrictEqual(id);
    expect(firstRecord.name).toStrictEqual("Material 1");
    expect(firstRecord.code).toStrictEqual("material-1");
    expect(firstRecord.purchasePrice).toStrictEqual(undefined);
    expect(firstRecord.retailPrice).toStrictEqual(undefined);
    expect(firstRecord.status).toStrictEqual("active");
    expect(firstRecord.createdAt).toBeDefined();
    expect(firstRecord.updatedAt).toBeDefined();
    expect(firstRecord.deletedAt).toBeUndefined();
  });
});