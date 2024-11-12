import {
  PurchaseOrderAttributes,
  PurchaseOrderItemSyncAttributes,
} from "@app/common";
import { PurchaseOrderFacade } from "@app/engine";
import {
  apiTest,
  checkStrayValues,
  injectStrayValues,
  validationRejection,
} from "~test/utils";

describe("Controller: createPurchaseOrderController", () => {
  it("should require authentication", async () => {
    await apiTest
      .testRequireAuthentication()
      .post("/purchase-order/id/sync-items");
  });
  it("should call PurchaseOrder facade sync function with required parameters", async () => {
    const id = "mock-id";
    const now = new Date();
    const payload: PurchaseOrderItemSyncAttributes = {
      materialId: "material-id",
      quantity: 1,
      unitPrice: 100,
      id: "1",
      remarks: "remarks",
    };
    const purchaseOrder: PurchaseOrderAttributes = {
      id,
      total: 5000,
      code: "sample-purchase-order-1",
      date: now,
      supplierId: "mock-supplier-id",
      createdAt: now,
      status: "draft",
      updatedAt: now,
    };
    PurchaseOrderFacade.prototype.sync = jest
      .fn()
      .mockResolvedValueOnce(injectStrayValues(purchaseOrder));
    const response = await apiTest
      .withAuthentication()
      .post("/purchase-order/mock-id/sync-items")
      .send(injectStrayValues({ items: [injectStrayValues(payload)] }));
    const { body, status } = response;
    expect(status).toStrictEqual(200);
    expect(PurchaseOrderFacade.prototype.sync).toHaveBeenCalledWith(
      id,
      // ensure filtering of stray values
      [{ ...payload }]
    );
    expect(body.id).toStrictEqual(id);
    expect(body.code).toStrictEqual("sample-purchase-order-1");
    expect(body.supplierId).toStrictEqual("mock-supplier-id");
    expect(body.date).toStrictEqual(now.toISOString());
    expect(body.status).toStrictEqual("draft");
    expect(body.createdAt).toBeDefined();
    expect(body.updatedAt).toBeDefined();
    expect(body.deletedAt).toBeUndefined();

    checkStrayValues(body);
  });

  it("should require items", async () => {
    const response = await apiTest
      .withAuthentication()
      .post("/purchase-order/mock-id/sync-items")
      .send([injectStrayValues({})]);
    validationRejection(response, [
      {
        type: "required",
        key: "body.items",
      },
    ]);
  });

  it("should require materialId, quantity, and unitPrice", async () => {
    const response = await apiTest
      .withAuthentication()
      .post("/purchase-order/mock-id/sync-items")
      .send(injectStrayValues({ items: [injectStrayValues({})] }));
    validationRejection(response, [
      {
        type: "required",
        key: "body.items.0.materialId",
      },
      {
        type: "required",
        key: "body.items.0.quantity",
      },
      {
        type: "required",
        key: "body.items.0.unitPrice",
      },
    ]);
  });

  it("should only accept correct data type", async () => {
    const response = await apiTest
      .withAuthentication()
      .post("/purchase-order/mock-id/sync-items")
      .send(
        injectStrayValues({
          items: [
            injectStrayValues({
              id: 125258284,
              materialId: true,
              quantity: "invalid",
              unitPrice: "invalid",
              remarks: false,
            }),
          ],
        })
      );
    validationRejection(response, [
      {
        type: "invalidType",
        key: "body.items.0.id",
        expected: "string",
        actual: "number",
        value: 125258284,
      },
      {
        type: "invalidType",
        key: "body.items.0.materialId",
        expected: "string",
        actual: "boolean",
        value: true,
      },
      {
        type: "invalidType",
        key: "body.items.0.quantity",
        expected: "number",
        actual: "string",
        value: "invalid",
      },
      {
        type: "invalidType",
        key: "body.items.0.remarks",
        expected: "string",
        actual: "boolean",
        value: false,
      },
      {
        type: "invalidType",
        key: "body.items.0.unitPrice",
        expected: "number",
        actual: "string",
        value: "invalid",
      },
    ]);
  });
});
