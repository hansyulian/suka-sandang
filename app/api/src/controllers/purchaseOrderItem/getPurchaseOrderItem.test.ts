import {
  PurchaseOrderItemEngine,
  PurchaseOrderItemNotFoundException,
} from "@app/core";
import { apiTest, checkStrayValues, injectStrayValues } from "~test/utils";
import { expectRejection } from "~test/utils/expectRejection";

describe("Controller: getPurchaseOrderItemController", () => {
  it("should require authentication", async () => {
    await apiTest
      .testRequireAuthentication()
      .get("/purchase-order-item/mock-id");
  });
  it("should call PurchaseOrderItem facade get function", async () => {
    const id = "mock-id";
    const now = new Date();
    PurchaseOrderItemEngine.prototype.findById = jest
      .fn()
      .mockResolvedValueOnce(
        injectStrayValues({
          id: id,
          materialId: "material-id",
          purchaseOrderId: "purchase-order-id",
          quantity: 5,
          unitPrice: 100,
          remarks: "Sample remarks",
          subTotal: 500,
          createdAt: now,
          updatedAt: now,
        })
      );
    const response = await apiTest
      .withAuthentication()
      .get(`/purchase-order-item/${id}`)
      .send();

    expect(PurchaseOrderItemEngine.prototype.findById).toHaveBeenCalledWith(id);
    const { body } = response;
    expect(body.id).toStrictEqual(id);
    expect(body.materialId).toStrictEqual("material-id");
    expect(body.remarks).toStrictEqual("Sample remarks");
    expect(body.purchaseOrderId).toStrictEqual("purchase-order-id");
    expect(body.quantity).toStrictEqual(5);
    expect(body.unitPrice).toStrictEqual(100);
    expect(body.subTotal).toStrictEqual(500);
    expect(body.createdAt).toBeDefined();
    expect(body.updatedAt).toBeDefined();
    checkStrayValues(body);
  });
  it("should handle not found exception if id not found", async () => {
    const id = "mock-id";
    PurchaseOrderItemEngine.prototype.findById = jest
      .fn()
      .mockRejectedValueOnce(
        new PurchaseOrderItemNotFoundException({
          id,
        })
      );
    const response = await apiTest
      .withAuthentication()
      .get(`/purchase-order-item/${id}`)
      .send();

    expect(PurchaseOrderItemEngine.prototype.findById).toHaveBeenCalledWith(id);
    expectRejection(response, new PurchaseOrderItemNotFoundException({ id }));
  });
});
