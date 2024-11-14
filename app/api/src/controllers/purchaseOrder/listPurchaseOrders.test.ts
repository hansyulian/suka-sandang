import { PurchaseOrderEngine } from "@app/engine";
import { extractQueryParameters, generateStringLikeQuery } from "~/utils";
import { apiTest, checkStrayValues, injectStrayValues } from "~test/utils";

describe("Controller: listPurchaseOrdersController", () => {
  it("should require authentication", async () => {
    await apiTest.testRequireAuthentication().get("/purchase-order");
  });
  it("should call PurchaseOrder facade list function", async () => {
    const id = "mock-id";
    const now = new Date();
    PurchaseOrderEngine.prototype.list = jest.fn().mockResolvedValueOnce(
      injectStrayValues({
        records: [
          injectStrayValues({
            id: id,
            code: "sample-purchase-order-1",
            date: now,
            supplierId: "mock-supplier-id",
            createdAt: now,
            status: "draft",
            updatedAt: now,
            purchaseOrderItems: [
              injectStrayValues({
                id: id,
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
          }),
        ],
        count: 1,
      })
    );
    const response = await apiTest
      .withAuthentication()
      .get(`/purchase-order`)
      .send();

    expect(PurchaseOrderEngine.prototype.list).toHaveBeenCalledWith(
      {},
      extractQueryParameters({})
    );
    const { body } = response;
    checkStrayValues(body);
    expect(body.info).toEqual({ count: 1 });
    expect(body.records.length).toStrictEqual(1);
    const firstRecord = body.records[0];
    checkStrayValues(firstRecord);
    expect(firstRecord.id).toStrictEqual(id);
    expect(firstRecord.code).toStrictEqual("sample-purchase-order-1");
    expect(firstRecord.supplierId).toStrictEqual("mock-supplier-id");
    expect(firstRecord.date).toStrictEqual(now.toISOString());
    expect(firstRecord.status).toStrictEqual("draft");
    expect(firstRecord.createdAt).toBeDefined();
    expect(firstRecord.updatedAt).toBeDefined();
    expect(firstRecord.deletedAt).toBeUndefined();
    expect(firstRecord.supplier).toBeDefined();
    expect(firstRecord.purchaseOrderItems).toBeUndefined();
    const supplier = firstRecord.supplier;
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
  });
  it("should handle queries", async () => {
    const id = "mock-id";
    const now = new Date();
    PurchaseOrderEngine.prototype.list = jest.fn().mockResolvedValueOnce({
      records: [
        {
          id: id,
          code: "sample-purchase-order-1",
          date: now,
          supplierId: "mock-supplier-id",
          createdAt: now,
          status: "draft",
          updatedAt: now,
        },
      ],
      count: 1,
    });
    const query = {
      code: "sample-purchase-order",
    };
    const response = await apiTest
      .withAuthentication()
      .get(`/purchase-order`)
      .query(injectStrayValues(query))
      .send();

    expect(PurchaseOrderEngine.prototype.list).toHaveBeenCalledWith(
      generateStringLikeQuery(query),
      extractQueryParameters({})
    );
    const { body } = response;
    expect(body.info).toEqual({ count: 1 });
    expect(body.records.length).toStrictEqual(1);
    const firstRecord = body.records[0];
    expect(firstRecord.id).toStrictEqual(id);
    expect(firstRecord.code).toStrictEqual("sample-purchase-order-1");
    expect(firstRecord.supplierId).toStrictEqual("mock-supplier-id");
    expect(firstRecord.date).toStrictEqual(now.toISOString());
    expect(firstRecord.status).toStrictEqual("draft");
    expect(firstRecord.createdAt).toBeDefined();
    expect(firstRecord.updatedAt).toBeDefined();
    expect(firstRecord.deletedAt).toBeUndefined();
  });
  it("should handle search query", async () => {
    const id = "mock-id";
    const now = new Date();
    PurchaseOrderEngine.prototype.list = jest.fn().mockResolvedValueOnce({
      records: [
        {
          id: id,
          code: "sample-purchase-order-1",
          date: now,
          supplierId: "mock-supplier-id",
          createdAt: now,
          status: "draft",
          updatedAt: now,
        },
      ],
      count: 1,
    });
    const query = {
      search: "sample-purchase-order",
    };
    const response = await apiTest
      .withAuthentication()
      .get(`/purchase-order`)
      .query(injectStrayValues(query))
      .send();

    expect(PurchaseOrderEngine.prototype.list).toHaveBeenCalledWith(
      generateStringLikeQuery({
        code: query.search,
      }),
      extractQueryParameters({})
    );
    const { body } = response;
    expect(body.info).toEqual({ count: 1 });
    expect(body.records.length).toStrictEqual(1);
    const firstRecord = body.records[0];
    expect(firstRecord.id).toStrictEqual(id);
    expect(firstRecord.code).toStrictEqual("sample-purchase-order-1");
    expect(firstRecord.supplierId).toStrictEqual("mock-supplier-id");
    expect(firstRecord.date).toStrictEqual(now.toISOString());
    expect(firstRecord.status).toStrictEqual("draft");
    expect(firstRecord.createdAt).toBeDefined();
    expect(firstRecord.updatedAt).toBeDefined();
    expect(firstRecord.deletedAt).toBeUndefined();
  });
});
