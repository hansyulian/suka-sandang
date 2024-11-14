import {
  InventoryFlowAttributes,
  InventoryFlowActivity,
  InventoryFlowStatus,
} from "@app/common";
import { InventoryFlowEngine } from "@app/engine";
import { apiTest, checkStrayValues, injectStrayValues } from "~test/utils";

describe("Controller: listInventoryFlowsController", () => {
  it("should require authentication", async () => {
    await apiTest.testRequireAuthentication().get("/inventory-flow");
  });

  it("should call InventoryFlow facade list function", async () => {
    const inventoryId = "mock-inventory-id";
    const now = new Date();
    const nowString = now.toISOString();

    const mockInventoryFlow: InventoryFlowAttributes = {
      id: "mock-id",
      inventoryId,
      quantity: 100,
      activity: "procurement" as InventoryFlowActivity,
      status: "valid" as InventoryFlowStatus,
      remarks: "Sample flow",
      createdAt: now,
      updatedAt: now,
      deletedAt: now,
    };

    InventoryFlowEngine.prototype.list = jest.fn().mockResolvedValueOnce(
      injectStrayValues({
        count: 1,
        records: [injectStrayValues(mockInventoryFlow)],
      })
    );

    const response = await apiTest
      .withAuthentication()
      .get("/inventory-flow")
      .query({ inventoryId });

    const { body, status } = response;
    expect(status).toStrictEqual(200);
    expect(InventoryFlowEngine.prototype.list).toHaveBeenCalledWith(
      { inventoryId },
      {
        offset: undefined,
        limit: undefined,
        orderBy: undefined,
        orderDirection: undefined,
      }
    );
    checkStrayValues(body);
    expect(body.info).toEqual({ count: 1 });
    expect(body.records.length).toStrictEqual(1);

    const firstRecord = body.records[0];
    checkStrayValues(firstRecord);

    expect(firstRecord).toEqual({
      id: "mock-id",
      inventoryId,
      quantity: 100,
      activity: "procurement",
      status: "valid",
      remarks: "Sample flow",
      createdAt: nowString,
      updatedAt: nowString,
      deletedAt: nowString,
    });
  });
});
