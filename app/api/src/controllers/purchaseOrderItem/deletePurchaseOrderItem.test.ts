import {
  PurchaseOrderItemEngine,
  PurchaseOrderItemNotFoundException,
} from "@app/core";
import { apiTest } from "~test/utils";
import { expectRejection } from "~test/utils/expectRejection";

describe("Controller: deletePurchaseOrderItemController", () => {
  it("should require authentication", async () => {
    await apiTest
      .testRequireAuthentication()
      .delete("/purchase-order-item/mock-id");
  });
  it("should call PurchaseOrderItem facade delete function", async () => {
    PurchaseOrderItemEngine.prototype.delete = jest
      .fn()
      .mockResolvedValueOnce(undefined);
    const id = "mock-id";
    const response = await apiTest
      .withAuthentication()
      .delete(`/purchase-order-item/${id}`)
      .send();

    expect(PurchaseOrderItemEngine.prototype.delete).toHaveBeenCalledWith(id);
    const { body } = response;
    expect(body.status).toStrictEqual("success");
  });
  it("should handle not found exception if id not found", async () => {
    const id = "mock-id";
    PurchaseOrderItemEngine.prototype.delete = jest.fn().mockRejectedValueOnce(
      new PurchaseOrderItemNotFoundException({
        id,
      })
    );
    const response = await apiTest
      .withAuthentication()
      .delete(`/purchase-order-item/${id}`)
      .send();

    expect(PurchaseOrderItemEngine.prototype.delete).toHaveBeenCalledWith(id);
    expectRejection(response, new PurchaseOrderItemNotFoundException({ id }));
  });
});
