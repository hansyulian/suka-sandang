import {
  PurchaseOrderItemFacade,
  PurchaseOrderItemNotFoundException,
} from "@app/engine";
import { apiTest } from "~test/utils";
import { expectRejection } from "~test/utils/expectRejection";

describe("Controller: deletePurchaseOrderItemController", () => {
  it("should require authentication", async () => {
    await apiTest
      .testRequireAuthentication()
      .delete("/purchase-order-item/mock-id");
  });
  it("should call PurchaseOrderItem facade delete function", async () => {
    PurchaseOrderItemFacade.prototype.delete = jest
      .fn()
      .mockResolvedValueOnce(undefined);
    const id = "mock-id";
    const response = await apiTest
      .withAuthentication()
      .delete(`/purchase-order-item/${id}`)
      .send();

    expect(PurchaseOrderItemFacade.prototype.delete).toHaveBeenCalledWith(id);
    const { body } = response;
    expect(body.status).toStrictEqual("success");
  });
  it("should handle not found exception if id not found", async () => {
    const id = "mock-id";
    PurchaseOrderItemFacade.prototype.delete = jest.fn().mockRejectedValueOnce(
      new PurchaseOrderItemNotFoundException({
        id,
      })
    );
    const response = await apiTest
      .withAuthentication()
      .delete(`/purchase-order-item/${id}`)
      .send();

    expect(PurchaseOrderItemFacade.prototype.delete).toHaveBeenCalledWith(id);
    expectRejection(response, new PurchaseOrderItemNotFoundException({ id }));
  });
});
