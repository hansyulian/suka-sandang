import {
  SalesOrderItemEngine,
  SalesOrderItemNotFoundException,
} from "@app/core";
import { apiTest, checkStrayValues, injectStrayValues } from "~test/utils";
import { expectRejection } from "~test/utils/expectRejection";

describe("Controller: getSalesOrderItemController", () => {
  it("should require authentication", async () => {
    await apiTest.testRequireAuthentication().get("/sales-order-item/mock-id");
  });
  it("should call SalesOrderItem facade get function", async () => {
    const id = "mock-id";
    const now = new Date();
    SalesOrderItemEngine.prototype.findById = jest.fn().mockResolvedValueOnce(
      injectStrayValues({
        id: id,
        materialId: "material-id",
        salesOrderId: "sales-order-id",
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
      .get(`/sales-order-item/${id}`)
      .send();

    expect(SalesOrderItemEngine.prototype.findById).toHaveBeenCalledWith(id);
    const { body } = response;
    expect(body.id).toStrictEqual(id);
    expect(body.materialId).toStrictEqual("material-id");
    expect(body.remarks).toStrictEqual("Sample remarks");
    expect(body.salesOrderId).toStrictEqual("sales-order-id");
    expect(body.quantity).toStrictEqual(5);
    expect(body.unitPrice).toStrictEqual(100);
    expect(body.subTotal).toStrictEqual(500);
    expect(body.createdAt).toBeDefined();
    expect(body.updatedAt).toBeDefined();
    checkStrayValues(body);
  });
  it("should handle not found exception if id not found", async () => {
    const id = "mock-id";
    SalesOrderItemEngine.prototype.findById = jest.fn().mockRejectedValueOnce(
      new SalesOrderItemNotFoundException({
        id,
      })
    );
    const response = await apiTest
      .withAuthentication()
      .get(`/sales-order-item/${id}`)
      .send();

    expect(SalesOrderItemEngine.prototype.findById).toHaveBeenCalledWith(id);
    expectRejection(response, new SalesOrderItemNotFoundException({ id }));
  });
});
