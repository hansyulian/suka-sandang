import { InventoryUpdateAttributes, InventoryAttributes } from "@app/common";
import { InventoryEngine } from "@app/engine";
import {
  apiTest,
  checkStrayValues,
  injectStrayValues,
  validationRejection,
} from "~test/utils";

describe("Controller: updateInventoryController", () => {
  it("should require authentication", async () => {
    await apiTest.testRequireAuthentication().put("/inventory/mock-id");
  });

  it("should call Inventory facade update function", async () => {
    const id = "mock-id";
    const now = new Date();
    const nowString = now.toISOString();

    const payload: InventoryUpdateAttributes = {
      remarks: "Updated remarks",
    };

    const inventory: InventoryAttributes = {
      id,
      materialId: "sample-material-id",
      code: "sample-inventory-1",
      total: 5000,
      createdAt: now,
      updatedAt: now,
      deletedAt: now,
      remarks: "Updated remarks",
      status: "active",
    };

    InventoryEngine.prototype.update = jest
      .fn()
      .mockResolvedValueOnce(injectStrayValues(inventory));

    const response = await apiTest
      .withAuthentication()
      .put(`/inventory/${id}`)
      .send(injectStrayValues(payload));

    const { status, body } = response;
    expect(status).toStrictEqual(200);

    expect(InventoryEngine.prototype.update).toHaveBeenCalledWith(id, {
      remarks: "Updated remarks",
    });

    checkStrayValues(body);

    expect(body).toEqual({
      id,
      materialId: "sample-material-id",
      code: "sample-inventory-1",

      total: 5000,
      remarks: "Updated remarks",
      createdAt: nowString,
      updatedAt: nowString,
      deletedAt: nowString,
      status: "active",
    });
  });

  it("should call Inventory facade update function with empty payload", async () => {
    const id = "mock-id";
    const payload: InventoryUpdateAttributes = {};
    const now = new Date();
    const nowString = now.toISOString();

    const inventory: InventoryAttributes = {
      id,
      materialId: "sample-material-id",
      code: "sample-inventory-1",
      total: 5000,
      createdAt: now,
      updatedAt: now,
      deletedAt: now,
      status: "active",
      remarks: "empty remarks",
    };

    InventoryEngine.prototype.update = jest
      .fn()
      .mockResolvedValueOnce(injectStrayValues(inventory));

    const response = await apiTest
      .withAuthentication()
      .put(`/inventory/${id}`)
      .send(injectStrayValues(payload));

    const { body, status } = response;
    expect(status).toStrictEqual(200);

    expect(InventoryEngine.prototype.update).toHaveBeenCalledWith(id, {});

    checkStrayValues(body);

    expect(body).toEqual({
      id,
      materialId: "sample-material-id",
      code: "sample-inventory-1",

      total: 5000,
      remarks: "empty remarks",
      status: "active",
      createdAt: nowString,
      updatedAt: nowString,
      deletedAt: nowString,
    });
  });

  it("should only accept correct data type", async () => {
    const response = await apiTest
      .withAuthentication()
      .put("/inventory/mock-id")
      .send(
        injectStrayValues({
          date: "invalid date",
          remarks: true,
          status: "invalid",
        })
      );

    validationRejection(response, [
      {
        type: "invalidType",
        key: "body.remarks",
        expected: "string",
        actual: "boolean",
        value: true,
      },
    ]);
  });
});
