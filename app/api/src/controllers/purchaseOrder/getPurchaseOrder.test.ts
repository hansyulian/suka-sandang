import { PurchaseOrderEngine, PurchaseOrderNotFoundException } from "@app/core";
import { apiTest, checkStrayValues, injectStrayValues } from "~test/utils";
import { expectRejection } from "~test/utils/expectRejection";

describe("Controller: getPurchaseOrderController", () => {
  it("should require authentication", async () => {
    await apiTest.testRequireAuthentication().get("/purchase-order/mock-id");
  });
  it("should call PurchaseOrder facade get function", async () => {
    const idOrCode = "mock-id";
    const now = new Date();
    PurchaseOrderEngine.prototype.findByIdOrCode = jest
      .fn()
      .mockResolvedValueOnce({
        id: idOrCode,
        code: "sample-purchase-order-1",
        date: now,
        supplierId: "mock-supplier-id",
        createdAt: now,
        status: "draft",
        updatedAt: now,
        purchaseOrderItems: [
          injectStrayValues({
            id: "poi-id",
            materialId: "material-id",
            purchaseOrderId: "purchase-order-id",
            quantity: 5,
            unitPrice: 100,
            subTotal: 500,
            remarks: "",
            createdAt: now,
            updatedAt: now,
          }),
        ],
        supplier: injectStrayValues({
          id: "mock-supplier-id",
          name: "Supplier 1",
          address: "Address",
          email: "email@example.com",
          phone: "+62123123123",
          remarks: "remarks",
          identity: "3273",
          createdAt: new Date(),
          status: "active",
          updatedAt: new Date(),
        }),
      });
    const response = await apiTest
      .withAuthentication()
      .get(`/purchase-order/${idOrCode}`)
      .send();

    expect(PurchaseOrderEngine.prototype.findByIdOrCode).toHaveBeenCalledWith(
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
    const supplier = body.supplier;
    checkStrayValues(supplier);
    expect(supplier.id).toStrictEqual("mock-supplier-id");
    expect(supplier.name).toStrictEqual("Supplier 1");
    expect(supplier.email).toStrictEqual("email@example.com");
    expect(supplier.address).toStrictEqual("Address");
    expect(supplier.phone).toStrictEqual("+62123123123");
    expect(supplier.remarks).toStrictEqual("remarks");
    expect(supplier.status).toStrictEqual("active");
    expect(supplier.identity).toStrictEqual("3273");
    expect(supplier.createdAt).toBeDefined();
    expect(supplier.updatedAt).toBeDefined();
    expect(supplier.deletedAt).toBeUndefined();
    const purchaseOrderItems = body.purchaseOrderItems;
    const purchaseOrderItem = purchaseOrderItems[0];
    checkStrayValues(purchaseOrderItem);
    expect(purchaseOrderItem.id).toStrictEqual("poi-id");
    expect(purchaseOrderItem.materialId).toStrictEqual("material-id");
    expect(purchaseOrderItem.remarks).toStrictEqual("");
    expect(purchaseOrderItem.purchaseOrderId).toStrictEqual(
      "purchase-order-id"
    );
    expect(purchaseOrderItem.quantity).toStrictEqual(5);
    expect(purchaseOrderItem.unitPrice).toStrictEqual(100);
    expect(purchaseOrderItem.subTotal).toStrictEqual(500);
    expect(purchaseOrderItem.createdAt).toBeDefined();
    expect(purchaseOrderItem.updatedAt).toBeDefined();
  });
  it("should handle not found exception if id not found", async () => {
    const idOrCode = "mock-id";
    PurchaseOrderEngine.prototype.findByIdOrCode = jest
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

    expect(PurchaseOrderEngine.prototype.findByIdOrCode).toHaveBeenCalledWith(
      idOrCode
    );
    expectRejection(response, new PurchaseOrderNotFoundException({ idOrCode }));
  });
});
