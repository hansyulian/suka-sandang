import { MaterialFacade, MaterialNotFoundException } from "@app/engine";
import { apiTest } from "~test/utils";
import { expectRejection } from "~test/utils/expectRejection";

describe("Controller: getMaterialController", () => {
  it("should require authentication", async () => {
    await apiTest.testRequireAuthentication().get("/material/mock-id");
  });
  it("should call material facade get function", async () => {
    const idOrCode = "mock-id";
    MaterialFacade.prototype.findByIdOrCode = jest.fn().mockResolvedValueOnce({
      id: idOrCode,
      name: "Material 1",
      code: "material-1",
      purchasePrice: null,
      retailPrice: null,
      createdAt: new Date(),
      status: "active",
      updatedAt: new Date(),
    });
    const response = await apiTest
      .withAuthentication()
      .get(`/material/${idOrCode}`)
      .send();

    expect(MaterialFacade.prototype.findByIdOrCode).toHaveBeenCalledWith(
      idOrCode
    );
    const { body } = response;
    expect(body.id).toStrictEqual(idOrCode);
    expect(body.name).toStrictEqual("Material 1");
    expect(body.code).toStrictEqual("material-1");
    expect(body.purchasePrice).toStrictEqual(undefined);
    expect(body.retailPrice).toStrictEqual(undefined);
    expect(body.status).toStrictEqual("active");
    expect(body.createdAt).toBeDefined();
    expect(body.updatedAt).toBeDefined();
    expect(body.deletedAt).toBeUndefined();
  });
  it("should handle not found exception if id not found", async () => {
    const idOrCode = "mock-id";
    MaterialFacade.prototype.findByIdOrCode = jest.fn().mockRejectedValueOnce(
      new MaterialNotFoundException({
        idOrCode,
      })
    );
    const response = await apiTest
      .withAuthentication()
      .get(`/material/${idOrCode}`)
      .send();

    expect(MaterialFacade.prototype.findByIdOrCode).toHaveBeenCalledWith(
      idOrCode
    );
    expectRejection(response, new MaterialNotFoundException({ idOrCode }));
  });
});
