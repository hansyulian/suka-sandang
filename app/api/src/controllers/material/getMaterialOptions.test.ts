import { MaterialFacade } from "@app/engine";
import { extractQueryParameters, generateStringLikeQuery } from "~/utils";
import { apiTest, checkStrayValues, injectStrayValues } from "~test/utils";

describe("Controller: getMaterialOptionsController", () => {
  it("should require authentication", async () => {
    await apiTest.testRequireAuthentication().get("/material/options");
  });
  it("should call material facade list function", async () => {
    const id = "mock-id";
    MaterialFacade.prototype.list = jest.fn().mockResolvedValueOnce({
      records: [
        injectStrayValues({
          id: id,
          name: "Material 1",
          code: "material-1",
          purchasePrice: null,
          retailPrice: null,
          createdAt: new Date(),
          status: "active",
          updatedAt: new Date(),
        }),
      ],
    });
    const response = await apiTest
      .withAuthentication()
      .get(`/material/options`)
      .send();

    expect(MaterialFacade.prototype.list).toHaveBeenCalledWith(
      {},
      extractQueryParameters({})
    );
    const { body } = response;
    expect(body.records.length).toStrictEqual(1);
    const firstRecord = body.records[0];
    checkStrayValues(firstRecord);
    expect(firstRecord.id).toStrictEqual(id);
    expect(firstRecord.name).toStrictEqual("Material 1");
    expect(firstRecord.code).toStrictEqual("material-1");
    expect(firstRecord.purchasePrice).toBeUndefined();
    expect(firstRecord.retailPrice).toBeUndefined();
    expect(firstRecord.status).toBeUndefined();
    expect(firstRecord.createdAt).toBeUndefined();
    expect(firstRecord.updatedAt).toBeUndefined();
    expect(firstRecord.deletedAt).toBeUndefined();
  });
});
