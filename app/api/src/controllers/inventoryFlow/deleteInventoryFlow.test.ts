import { InventoryFlowEngine, InventoryFlowNotFoundException } from "@app/core";
import { apiTest } from "~test/utils";
import { expectRejection } from "~test/utils/expectRejection";

describe("Controller: deleteInventoryFlowController", () => {
  it("should require authentication", async () => {
    await apiTest.testRequireAuthentication().delete("/inventory-flow/mock-id");
  });
  it("should call InventoryFlow facade delete function", async () => {
    InventoryFlowEngine.prototype.delete = jest
      .fn()
      .mockResolvedValueOnce(undefined);
    const id = "mock-id";
    const response = await apiTest
      .withAuthentication()
      .delete(`/inventory-flow/${id}`)
      .send();

    expect(InventoryFlowEngine.prototype.delete).toHaveBeenCalledWith(id);
    const { body } = response;
    expect(body.status).toStrictEqual("success");
  });
  it("should handle not found exception if id not found", async () => {
    const id = "mock-id";
    InventoryFlowEngine.prototype.delete = jest.fn().mockRejectedValueOnce(
      new InventoryFlowNotFoundException({
        id,
      })
    );
    const response = await apiTest
      .withAuthentication()
      .delete(`/inventory-flow/${id}`)
      .send();

    expect(InventoryFlowEngine.prototype.delete).toHaveBeenCalledWith(id);
    expectRejection(response, new InventoryFlowNotFoundException({ id }));
  });
});
