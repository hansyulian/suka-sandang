import { MaterialUpdateAttributes, MaterialAttributes } from "@app/common";
import { MaterialFacade } from "@app/engine";
import {
  apiTest,
  checkStrayValues,
  injectStrayValues,
  validationRejection,
} from "~test/utils";

describe("Controller: updateMaterialController", () => {
  it("should require authentication", async () => {
    await apiTest.testRequireAuthentication().put("/material/mock-id");
  });
  it("should call material facade update function", async () => {
    const id = "mock-id";
    const payload: MaterialUpdateAttributes = {
      name: "Material 1",
      code: "material-1",
      status: "active",
    };
    const material: MaterialAttributes = {
      id,
      createdAt: new Date(),
      updatedAt: new Date(),
      ...payload,
    } as MaterialAttributes;
    MaterialFacade.prototype.update = jest
      .fn()
      .mockResolvedValueOnce(injectStrayValues(material));
    const response = await apiTest
      .withAuthentication()
      .put(`/material/${id}`)
      .send(injectStrayValues(payload));
    const { status, body } = response;
    expect(status).toStrictEqual(200);

    expect(MaterialFacade.prototype.update).toHaveBeenCalledWith(id, payload);
    expect(body.id).toStrictEqual(id);
    expect(body.name).toStrictEqual("Material 1");
    expect(body.code).toStrictEqual("material-1");
    expect(body.purchasePrice).toStrictEqual(undefined);
    expect(body.retailPrice).toStrictEqual(undefined);
    expect(body.createdAt).toBeDefined();
    expect(body.updatedAt).toBeDefined();
    expect(body.status).toStrictEqual("active");
    expect(body.deletedAt).toBeUndefined();
    checkStrayValues(body);
  });

  it("should call material facade update function while even with empty payload", async () => {
    const id = "mock-id";
    const payload: MaterialUpdateAttributes = {
      code: "material-1",
      name: "Material 1",
      status: "active",
    };
    const material: MaterialAttributes = {
      id,
      createdAt: new Date(),
      updatedAt: new Date(),
      purchasePrice: 100,
      retailPrice: 110,
      ...payload,
    } as MaterialAttributes;
    MaterialFacade.prototype.update = jest
      .fn()
      .mockResolvedValueOnce(injectStrayValues(material));
    const response = await apiTest
      .withAuthentication()
      .put(`/material/${id}`)
      .send(injectStrayValues(payload));
    const { body, status } = response;
    expect(status).toStrictEqual(200);

    expect(MaterialFacade.prototype.update).toHaveBeenCalledWith(id, {
      code: "material-1",
      name: "Material 1",
      status: "active",
    });
    expect(body.id).toStrictEqual(id);
    expect(body.name).toStrictEqual("Material 1");
    expect(body.code).toStrictEqual("material-1");
    expect(body.purchasePrice).toStrictEqual(100);
    expect(body.retailPrice).toStrictEqual(110);
    expect(body.createdAt).toBeDefined();
    expect(body.updatedAt).toBeDefined();
    expect(body.status).toStrictEqual("active");
    expect(body.deletedAt).toBeUndefined();
    checkStrayValues(body);
  });

  it("should require name and code", async () => {
    const response = await apiTest.withAuthentication().post("/material").send({
      // ensure the filtering of stray values
      strayValue1: "stray value 1",
      handsomeValue: 123456,
    });
    validationRejection(response, [
      {
        type: "required",
        key: "body.name",
      },
      {
        type: "required",
        key: "body.code",
      },
    ]);
  });

  it("should only accept correct data type", async () => {
    const response = await apiTest.withAuthentication().post("/material").send({
      name: 125258284,
      code: true,
      purchasePrice: "21591295",
      retailPrice: true,
      // ensure the filtering of stray values
      strayValue1: "stray value 1",
      handsomeValue: 123456,
    });
    validationRejection(response, [
      {
        type: "invalidType",
        key: "body.name",
        expected: "string",
        actual: "number",
        value: 125258284,
      },
      {
        type: "invalidType",
        key: "body.code",
        expected: "string",
        actual: "boolean",
        value: true,
      },
      {
        type: "invalidType",
        key: "body.purchasePrice",
        expected: "number",
        actual: "string",
        value: "21591295",
      },
      {
        type: "invalidType",
        key: "body.retailPrice",
        expected: "number",
        actual: "boolean",
        value: true,
      },
    ]);
  });
});
