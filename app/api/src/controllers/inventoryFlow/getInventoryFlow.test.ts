import {
  InventoryFlowAttributes,
  InventoryFlowActivity,
  InventoryFlowStatus,
} from "@app/common";
import { InventoryFlowEngine } from "@app/engine";
import { apiTest, checkStrayValues } from "~test/utils";

describe("Controller: getInventoryFlowController", () => {
  it("should require authentication", async () => {
    await apiTest.testRequireAuthentication().get("/inventory-flow/mock-id");
  });

  it("should call InventoryFlow facade findById function", async () => {
    const now = new Date();
    const nowString = now.toISOString();

    const mockInventoryFlow: InventoryFlowAttributes = {
      id: "mock-id",
      inventoryId: "mock-inventory-id",
      quantity: 100,
      activity: "procurement" as InventoryFlowActivity,
      status: "valid" as InventoryFlowStatus,
      remarks: "Sample inventory flow",
      createdAt: now,
      updatedAt: now,
      deletedAt: now,
    };

    InventoryFlowEngine.prototype.findById = jest
      .fn()
      .mockResolvedValueOnce(mockInventoryFlow);

    const response = await apiTest
      .withAuthentication()
      .get("/inventory-flow/mock-id");

    const { body, status } = response;
    expect(status).toEqual(200);
    expect(InventoryFlowEngine.prototype.findById).toHaveBeenCalledWith(
      "mock-id"
    );

    checkStrayValues(body);
    expect(body).toEqual({
      id: "mock-id",
      inventoryId: "mock-inventory-id",
      quantity: 100,
      activity: "procurement",
      status: "valid",
      remarks: "Sample inventory flow",
      createdAt: nowString,
      updatedAt: nowString,
      deletedAt: nowString,
    });
  });
});
