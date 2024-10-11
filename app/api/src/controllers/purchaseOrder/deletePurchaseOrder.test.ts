import {
  PurchaseOrderFacade,
  PurchaseOrderNotFoundException,
} from "@app/engine";
import { apiTest } from "~test/utils";
import { expectRejection } from "~test/utils/expectRejection";

describe("Controller: deletePurchaseOrderController", () => {
  it("should require authentication", async () => {
    await apiTest.testRequireAuthentication().delete("/purchase-order/mock-id");
  });
  it("should call PurchaseOrder facade delete function", async () => {
    PurchaseOrderFacade.prototype.delete = jest
      .fn()
      .mockResolvedValueOnce(undefined);
    const id = "mock-id";
    const response = await apiTest
      .withAuthentication()
      .delete(`/purchase-order/${id}`)
      .send();

    expect(PurchaseOrderFacade.prototype.delete).toHaveBeenCalledWith(id);
    const { body } = response;
    expect(body.status).toStrictEqual("success");
  });
  it("should handle not found exception if id not found", async () => {
    const id = "mock-id";
    PurchaseOrderFacade.prototype.delete = jest.fn().mockRejectedValueOnce(
      new PurchaseOrderNotFoundException({
        id,
      })
    );
    const response = await apiTest
      .withAuthentication()
      .delete(`/purchase-order/${id}`)
      .send();

    expect(PurchaseOrderFacade.prototype.delete).toHaveBeenCalledWith(id);
    expectRejection(response, new PurchaseOrderNotFoundException({ id }));
  });
});
