import {
  InventoryFlowAttributes,
  InventoryFlowActivity,
  InventoryFlowStatus,
  InventoryFlowUpdateAttributes,
  inventoryFlowActivity,
} from "@app/common";
import { InventoryFlowFacade } from "@app/engine";
import {
  apiTest,
  checkStrayValues,
  injectStrayValues,
  validationRejection,
} from "~test/utils";

describe("Controller: updateInventoryFlowController", () => {
  it("should require authentication", async () => {
    await apiTest.testRequireAuthentication().put("/inventory-flow/mock-id");
  });

  it("should call InventoryFlow facade update function", async () => {
    const now = new Date();
    const nowString = now.toISOString();

    const payload: InventoryFlowUpdateAttributes = {
      activity: "adjustment" as InventoryFlowActivity,
      quantity: 200,
      remarks: "Updated inventory flow",
    };

    const updatedInventoryFlow: InventoryFlowAttributes = {
      id: "mock-id",
      inventoryId: "mock-inventory-id",
      quantity: 200,
      activity: "adjustment",
      status: "valid" as InventoryFlowStatus,
      remarks: "Updated inventory flow",
      createdAt: now,
      updatedAt: now,
      deletedAt: now,
    };

    InventoryFlowFacade.prototype.update = jest
      .fn()
      .mockResolvedValueOnce(injectStrayValues(updatedInventoryFlow));

    const response = await apiTest
      .withAuthentication()
      .put("/inventory-flow/mock-id")
      .send(injectStrayValues(payload));

    const { body, status } = response;
    expect(status).toEqual(200);
    expect(InventoryFlowFacade.prototype.update).toHaveBeenCalledWith(
      "mock-id",
      payload
    );

    checkStrayValues(body);
    expect(body).toEqual({
      id: "mock-id",
      inventoryId: "mock-inventory-id",
      quantity: 200,
      activity: "adjustment",
      status: "valid",
      remarks: "Updated inventory flow",
      createdAt: nowString,
      updatedAt: nowString,
      deletedAt: nowString,
    });
  });

  it("should reject invalid input data types", async () => {
    const response = await apiTest
      .withAuthentication()
      .put("/inventory-flow/mock-id")
      .send(
        injectStrayValues({
          quantity: "not-a-number",
          activity: "invalid-activity",
          remarks: 98765,
        })
      );

    validationRejection(response, [
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
