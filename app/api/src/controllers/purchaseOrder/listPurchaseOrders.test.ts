import { PurchaseOrderFacade } from "@app/engine";
import { extractQueryParameters, generateStringLikeQuery } from "~/utils";
import { apiTest, injectStrayValues } from "~test/utils";

describe("Controller: listPurchaseOrdersController", () => {
  it("should require authentication", async () => {
    await apiTest.testRequireAuthentication().get("/purchase-order");
  });
  it("should call PurchaseOrder facade list function", async () => {
    const id = "mock-id";
    const now = new Date();
    PurchaseOrderFacade.prototype.list = jest.fn().mockResolvedValueOnce({
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
    const response = await apiTest
      .withAuthentication()
      .get(`/purchase-order`)
      .send();

    expect(PurchaseOrderFacade.prototype.list).toHaveBeenCalledWith(
      {},
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
  it("should handle queries", async () => {
    const id = "mock-id";
    const now = new Date();
    PurchaseOrderFacade.prototype.list = jest.fn().mockResolvedValueOnce({
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

    expect(PurchaseOrderFacade.prototype.list).toHaveBeenCalledWith(
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
    PurchaseOrderFacade.prototype.list = jest.fn().mockResolvedValueOnce({
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

    expect(PurchaseOrderFacade.prototype.list).toHaveBeenCalledWith(
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
