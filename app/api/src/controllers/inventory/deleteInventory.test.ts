import { InventoryFacade, InventoryNotFoundException } from "@app/engine";
import { apiTest } from "~test/utils";
import { expectRejection } from "~test/utils/expectRejection";

describe("Controller: deleteInventoryController", () => {
  it("should require authentication", async () => {
    await apiTest.testRequireAuthentication().delete("/inventory/mock-id");
  });
  it("should call Inventory facade delete function", async () => {
    InventoryFacade.prototype.delete = jest
      .fn()
      .mockResolvedValueOnce(undefined);
    const id = "mock-id";
    const response = await apiTest
      .withAuthentication()
      .delete(`/inventory/${id}`)
      .send();

    expect(InventoryFacade.prototype.delete).toHaveBeenCalledWith(id);
    const { body } = response;
    expect(body).toEqual({ status: "success" });
  });
  it("should handle not found exception if id not found", async () => {
    const id = "mock-id";
    InventoryFacade.prototype.delete = jest.fn().mockRejectedValueOnce(
      new InventoryNotFoundException({
        id,
      })
    );
    const response = await apiTest
      .withAuthentication()
      .delete(`/inventory/${id}`)
      .send();

    expect(InventoryFacade.prototype.delete).toHaveBeenCalledWith(id);
    expectRejection(response, new InventoryNotFoundException({ id }));
  });
});
