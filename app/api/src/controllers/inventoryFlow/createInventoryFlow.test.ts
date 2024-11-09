import {
  InventoryFlowAttributes,
  InventoryFlowCreationAttributes,
  InventoryFlowActivity,
  inventoryFlowActivity,
} from "@app/common";
import { InventoryFlowFacade } from "@app/engine";
import {
  apiTest,
  checkStrayValues,
  injectStrayValues,
  validationRejection,
} from "~test/utils";

describe("Controller: createInventoryFlowController", () => {
  it("should require authentication", async () => {
    await apiTest.testRequireAuthentication().post("/inventory-flow");
  });

  it("should call InventoryFlow facade create function", async () => {
    const now = new Date();
    const nowString = now.toISOString();

    const payload: InventoryFlowCreationAttributes = {
      inventoryId: "mock-inventory-id",
      quantity: 150,
      activity: "procurement",
      purchaseOrderItemId: "mock-po-item-id",
      remarks: "New inventory flow",
    };

    const mockInventoryFlow: InventoryFlowAttributes = {
      id: "mock-id",
      createdAt: now,
      updatedAt: now,
      deletedAt: now,
      status: "valid",
      activity: "adjustment",
      ...payload,
    };

    InventoryFlowFacade.prototype.create = jest
      .fn()
      .mockResolvedValueOnce(injectStrayValues(mockInventoryFlow));

    const response = await apiTest
      .withAuthentication()
      .post("/inventory-flow")
      .send(injectStrayValues(payload));

    const { body, status } = response;
    expect(status).toEqual(200);
    expect(InventoryFlowFacade.prototype.create).toHaveBeenCalledWith(payload);

    checkStrayValues(body);
    expect(body).toEqual({
      id: "mock-id",
      inventoryId: "mock-inventory-id",
      quantity: 150,
      activity: "procurement",
      purchaseOrderItemId: "mock-po-item-id",
      remarks: "New inventory flow",
      status: "valid",
      createdAt: nowString,
      updatedAt: nowString,
      deletedAt: nowString,
    });
  });

  it("should reject invalid input data types", async () => {
    const response = await apiTest
      .withAuthentication()
      .post("/inventory-flow")
      .send(
        injectStrayValues({
          inventoryId: 12345,
          quantity: "not-a-number",
          activity: "invalid-activity",
          remarks: 98765,
        })
      );

    validationRejection(response, [
      {
        key: "body.inventoryId",
        type: "invalidType",
        expected: "string",
        actual: "number",
        value: 12345,
      },
      {
        key: "body.quantity",
        type: "invalidType",
        expected: "number",
        actual: "string",
        value: "not-a-number",
      },
      {
        key: "body.activity",
        type: "invalidValue",
        expected: inventoryFlowActivity,
        value: "invalid-activity",
      },
      {
        key: "body.remarks",
        type: "invalidType",
        expected: "string",
        actual: "number",
        value: 98765,
      },
    ]);
  });
});
