import { SalesOrderItemEngine } from "@app/core";
import { extractQueryParameters } from "~/utils/extractQueryParemeters";
import { apiTest, checkStrayValues, injectStrayValues } from "~test/utils";

describe("Controller: listSalesOrderItemsController", () => {
  it("should require authentication", async () => {
    await apiTest.testRequireAuthentication().get("/sales-order-item");
  });
  it("should call SalesOrderItem facade list function", async () => {
    const id = "mock-id";
    const now = new Date();
    SalesOrderItemEngine.prototype.list = jest.fn().mockResolvedValueOnce({
      records: [
        injectStrayValues({
          id: id,
          materialId: "material-id",
          salesOrderId: "sales-order-id",
          quantity: 5,
          unitPrice: 100,
          subTotal: 500,
          remarks: "",
          createdAt: now,
          updatedAt: now,
        }),
      ],
      count: 1,
    });
    const response = await apiTest
      .withAuthentication()
      .get(`/sales-order-item`)
      .send();

    expect(SalesOrderItemEngine.prototype.list).toHaveBeenCalledWith(
      {},
      extractQueryParameters({})
    );
    const { body } = response;
    expect(body.info).toEqual({ count: 1 });
    expect(body.records.length).toStrictEqual(1);
    const firstRecord = body.records[0];
    checkStrayValues(firstRecord);
    expect(firstRecord.id).toStrictEqual(id);
    expect(firstRecord.materialId).toStrictEqual("material-id");
    expect(firstRecord.remarks).toStrictEqual("");
    expect(firstRecord.salesOrderId).toStrictEqual("sales-order-id");
    expect(firstRecord.quantity).toStrictEqual(5);
    expect(firstRecord.unitPrice).toStrictEqual(100);
    expect(firstRecord.subTotal).toStrictEqual(500);
    expect(firstRecord.createdAt).toBeDefined();
    expect(firstRecord.updatedAt).toBeDefined();
  });
  it("should handle queries", async () => {
    const id = "mock-id";
    const now = new Date();
    SalesOrderItemEngine.prototype.list = jest.fn().mockResolvedValueOnce({
      records: [
        injectStrayValues({
          id: id,
          materialId: "material-id",
          salesOrderId: "sales-order-id",
          quantity: 5,
          unitPrice: 100,
          remarks: "",
          subTotal: 500,
          createdAt: now,
          updatedAt: now,
        }),
      ],
      count: 1,
    });
    const query = {
      salesOrderId: "sales-order-id",
    };
    const response = await apiTest
      .withAuthentication()
      .get(`/sales-order-item`)
      .query(injectStrayValues(query))
      .send();

    expect(SalesOrderItemEngine.prototype.list).toHaveBeenCalledWith(
      { salesOrderId: "sales-order-id" },
      extractQueryParameters({})
    );
    const { body } = response;
    expect(body.info).toEqual({ count: 1 });
    expect(body.records.length).toStrictEqual(1);
    const firstRecord = body.records[0];
    checkStrayValues(firstRecord);
    expect(firstRecord.id).toStrictEqual(id);
    expect(firstRecord.materialId).toStrictEqual("material-id");
    expect(firstRecord.remarks).toStrictEqual("");
    expect(firstRecord.salesOrderId).toStrictEqual("sales-order-id");
    expect(firstRecord.quantity).toStrictEqual(5);
    expect(firstRecord.unitPrice).toStrictEqual(100);
    expect(firstRecord.subTotal).toStrictEqual(500);
    expect(firstRecord.createdAt).toBeDefined();
    expect(firstRecord.updatedAt).toBeDefined();
  });
});
