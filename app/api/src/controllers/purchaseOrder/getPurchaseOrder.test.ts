import {
  PurchaseOrderFacade,
  PurchaseOrderNotFoundException,
} from "@app/engine";
import { apiTest } from "~test/utils";
import { expectRejection } from "~test/utils/expectRejection";

describe("Controller: getPurchaseOrderController", () => {
  it("should require authentication", async () => {
    await apiTest.testRequireAuthentication().get("/purchase-order/mock-id");
  });
  it("should call PurchaseOrder facade get function", async () => {
    const idOrCode = "mock-id";
    const now = new Date();
    PurchaseOrderFacade.prototype.findByIdOrCode = jest
      .fn()
      .mockResolvedValueOnce({
        id: idOrCode,
        code: "sample-purchase-order-1",
        date: now,
        supplierId: "mock-supplier-id",
        createdAt: now,
        status: "draft",
        updatedAt: now,
      });
    const response = await apiTest
      .withAuthentication()
      .get(`/purchase-order/${idOrCode}`)
      .send();

    expect(PurchaseOrderFacade.prototype.findByIdOrCode).toHaveBeenCalledWith(
      idOrCode
    );
    const { body } = response;
    expect(body.id).toStrictEqual(idOrCode);
    expect(body.code).toStrictEqual("sample-purchase-order-1");
    expect(body.supplierId).toStrictEqual("mock-supplier-id");
    expect(body.date).toStrictEqual(now.toISOString());
    expect(body.status).toStrictEqual("draft");
    expect(body.createdAt).toBeDefined();
    expect(body.updatedAt).toBeDefined();
    expect(body.deletedAt).toBeUndefined();
  });
  it("should handle not found exception if id not found", async () => {
    const idOrCode = "mock-id";
    PurchaseOrderFacade.prototype.findByIdOrCode = jest
      .fn()
      .mockRejectedValueOnce(
        new PurchaseOrderNotFoundException({
          idOrCode,
        })
      );
    const response = await apiTest
      .withAuthentication()
      .get(`/purchase-order/${idOrCode}`)
      .send();

    expect(PurchaseOrderFacade.prototype.findByIdOrCode).toHaveBeenCalledWith(
      idOrCode
    );
    expectRejection(response, new PurchaseOrderNotFoundException({ idOrCode }));
  });
});
