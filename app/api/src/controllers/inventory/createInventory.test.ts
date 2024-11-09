import { InventoryCreationAttributes, InventoryAttributes } from "@app/common";
import { InventoryFacade } from "@app/engine";
import {
  apiTest,
  checkStrayValues,
  injectStrayValues,
  validationRejection,
} from "~test/utils";

describe("Controller: createInventoryController", () => {
  it("should require authentication", async () => {
    await apiTest.testRequireAuthentication().post("/inventory");
  });

  it("should call Inventory facade create function with required parameters", async () => {
    const id = "mock-id";
    const now = new Date();
    const payload: InventoryCreationAttributes = {
      code: "sample-inventory-1",
      materialId: "mock-material-id",
    };

    const record: InventoryAttributes = {
      id,
      createdAt: now,
      updatedAt: now,
      deletedAt: undefined,
      remarks: "",
      total: 0,
      ...payload,
    };

    InventoryFacade.prototype.create = jest
      .fn()
      .mockResolvedValueOnce(injectStrayValues(record));

    const response = await apiTest
      .withAuthentication()
      .post("/inventory")
      .send(injectStrayValues(payload));

    expect(response.status).toStrictEqual(200);
    expect(InventoryFacade.prototype.create).toHaveBeenCalledWith({
      ...payload,
      remarks: undefined,
    });

    const { body } = response;
    checkStrayValues(body);

    expect(body).toEqual({
      id,
      code: "sample-inventory-1",
      materialId: "mock-material-id",
      total: 0,
      createdAt: expect.any(String),
      updatedAt: expect.any(String),
      remarks: "",
    });
  });

  it("should call Inventory facade create function while passing optional parameter as well", async () => {
    const id = "mock-id";
    const now = new Date();
    const nowString = now.toISOString();
    const payload: InventoryCreationAttributes = {
      code: "sample-inventory-1",
      materialId: "mock-material-id",
      remarks: "Sample remarks",
    };

    const inventory: InventoryAttributes = {
      id,
      createdAt: now,
      updatedAt: now,
      deletedAt: now,
      total: 0,
      ...payload,
    };

    InventoryFacade.prototype.create = jest
      .fn()
      .mockResolvedValueOnce(injectStrayValues(inventory));

    const response = await apiTest
      .withAuthentication()
      .post("/inventory")
      .send(injectStrayValues(payload));

    expect(response.status).toStrictEqual(200);
    expect(InventoryFacade.prototype.create).toHaveBeenCalledWith(payload);

    const { body } = response;

    expect(body).toEqual({
      id,
      code: "sample-inventory-1",
      materialId: "mock-material-id",
      remarks: "Sample remarks",
      total: 0,
      createdAt: nowString,
      updatedAt: nowString,
      deletedAt: nowString,
    });

    checkStrayValues(body);
  });

  it("should require code and materialId", async () => {
    const response = await apiTest
      .withAuthentication()
      .post("/inventory")
      .send({
        strayValue1: "stray value 1",
        handsomeValue: 123456,
      });

    validationRejection(response, [
      {
        type: "required",
        key: "body.code",
      },
      {
        type: "required",
        key: "body.materialId",
      },
    ]);
  });

  it("should only accept correct data type", async () => {
    const response = await apiTest
      .withAuthentication()
      .post("/inventory")
      .send(
        injectStrayValues({
          code: true,
          materialId: 123,
          remarks: true,
        })
      );

    validationRejection(response, [
      {
        type: "invalidType",
        key: "body.materialId",
        expected: "string",
        actual: "number",
        value: 123,
      },
      {
        type: "invalidType",
        key: "body.remarks",
        expected: "string",
        actual: "boolean",
        value: true,
      },
      {
        type: "invalidType",
        key: "body.code",
        expected: "string",
        actual: "boolean",
        value: true,
      },
    ]);
  });
});
