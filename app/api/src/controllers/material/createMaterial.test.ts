import { MaterialCreationAttributes, MaterialAttributes } from "@app/common";
import { MaterialFacade } from "@app/engine";
import {
  apiTest,
  checkStrayValues,
  injectStrayValues,
  validationRejection,
} from "~test/utils";

describe("Controller: createMaterialController", () => {
  it("should require authentication", async () => {
    await apiTest.testRequireAuthentication().post("/material");
  });
  it("should call material facade create function with required parameters", async () => {
    const id = "mock-id";
    const payload: MaterialCreationAttributes = {
      name: "Material 1",
      code: "material-1",
      status: "pending",
    };
    const material: MaterialAttributes = {
      id,
      createdAt: new Date(),
      updatedAt: new Date(),

      ...payload,
    };
    MaterialFacade.prototype.create = jest
      .fn()
      .mockResolvedValueOnce(injectStrayValues(material));
    const response = await apiTest
      .withAuthentication()
      .post("/material")
      .send(injectStrayValues(payload));
    expect(response.status).toStrictEqual(200);
    expect(MaterialFacade.prototype.create).toHaveBeenCalledWith({
      // ensure filtering of stray values
      ...payload,
    });
    const { body } = response;
    expect(body.id).toStrictEqual(id);
    expect(body.name).toStrictEqual("Material 1");
    expect(body.code).toStrictEqual("material-1");
    expect(body.purchasePrice).toStrictEqual(undefined);
    expect(body.retailPrice).toStrictEqual(undefined);
    expect(body.createdAt).toBeDefined();
    expect(body.updatedAt).toBeDefined();
    expect(body.status).toStrictEqual("pending");
    expect(body.deletedAt).toBeUndefined();

    checkStrayValues(body);
  });

  it("should call material facade create function while passing optional parameter as well", async () => {
    const id = "mock-id";
    const payload: MaterialCreationAttributes = {
      name: "Material 1",
      code: "material-1",
      purchasePrice: 100,
      retailPrice: 110,
      status: "pending",
      color: "#000000",
    };
    const material: MaterialAttributes = {
      id,
      createdAt: new Date(),
      updatedAt: new Date(),

      ...payload,
    };
    (MaterialFacade.prototype.create as jest.Mock).mockResolvedValueOnce(
      injectStrayValues(material)
    );
    const response = await apiTest
      .withAuthentication()
      .post("/material")
      .send(injectStrayValues(payload));

    expect(response.status).toStrictEqual(200);
    expect(MaterialFacade.prototype.create).toHaveBeenCalledWith(payload);
    const { body } = response;
    expect(body.id).toStrictEqual(id);
    expect(body.name).toStrictEqual("Material 1");
    expect(body.code).toStrictEqual("material-1");
    expect(body.purchasePrice).toStrictEqual(100);
    expect(body.retailPrice).toStrictEqual(110);
    expect(body.createdAt).toBeDefined();
    expect(body.updatedAt).toBeDefined();
    expect(body.status).toStrictEqual("pending");
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
