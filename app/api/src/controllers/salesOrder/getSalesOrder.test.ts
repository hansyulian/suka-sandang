import { SalesOrderEngine, SalesOrderNotFoundException } from "@app/core";
import { apiTest, checkStrayValues, injectStrayValues } from "~test/utils";
import { expectRejection } from "~test/utils/expectRejection";

describe("Controller: getSalesOrderController", () => {
  it("should require authentication", async () => {
    await apiTest.testRequireAuthentication().get("/sales-order/mock-id");
  });
  it("should call SalesOrder facade get function", async () => {
    const idOrCode = "mock-id";
    const now = new Date();
    SalesOrderEngine.prototype.findByIdOrCode = jest
      .fn()
      .mockResolvedValueOnce({
        id: idOrCode,
        code: "sample-sales-order-1",
        date: now,
        customerId: "mock-customer-id",
        createdAt: now,
        status: "draft",
        updatedAt: now,
        salesOrderItems: [
          injectStrayValues({
            id: "poi-id",
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
        customer: injectStrayValues({
          id: "mock-customer-id",
          name: "Customer 1",
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
      .get(`/sales-order/${idOrCode}`)
      .send();

    expect(SalesOrderEngine.prototype.findByIdOrCode).toHaveBeenCalledWith(
      idOrCode
    );
    const { body } = response;
    expect(body.id).toStrictEqual(idOrCode);
    expect(body.code).toStrictEqual("sample-sales-order-1");
    expect(body.customerId).toStrictEqual("mock-customer-id");
    expect(body.date).toStrictEqual(now.toISOString());
    expect(body.status).toStrictEqual("draft");
    expect(body.createdAt).toBeDefined();
    expect(body.updatedAt).toBeDefined();
    expect(body.deletedAt).toBeUndefined();
    const customer = body.customer;
    checkStrayValues(customer);
    expect(customer.id).toStrictEqual("mock-customer-id");
    expect(customer.name).toStrictEqual("Customer 1");
    expect(customer.email).toStrictEqual("email@example.com");
    expect(customer.address).toStrictEqual("Address");
    expect(customer.phone).toStrictEqual("+62123123123");
    expect(customer.remarks).toStrictEqual("remarks");
    expect(customer.status).toStrictEqual("active");
    expect(customer.identity).toStrictEqual("3273");
    expect(customer.createdAt).toBeDefined();
    expect(customer.updatedAt).toBeDefined();
    expect(customer.deletedAt).toBeUndefined();
    const salesOrderItems = body.salesOrderItems;
    const salesOrderItem = salesOrderItems[0];
    checkStrayValues(salesOrderItem);
    expect(salesOrderItem.id).toStrictEqual("poi-id");
    expect(salesOrderItem.materialId).toStrictEqual("material-id");
    expect(salesOrderItem.remarks).toStrictEqual("");
    expect(salesOrderItem.salesOrderId).toStrictEqual("sales-order-id");
    expect(salesOrderItem.quantity).toStrictEqual(5);
    expect(salesOrderItem.unitPrice).toStrictEqual(100);
    expect(salesOrderItem.subTotal).toStrictEqual(500);
    expect(salesOrderItem.createdAt).toBeDefined();
    expect(salesOrderItem.updatedAt).toBeDefined();
  });
  it("should handle not found exception if id not found", async () => {
    const idOrCode = "mock-id";
    SalesOrderEngine.prototype.findByIdOrCode = jest.fn().mockRejectedValueOnce(
      new SalesOrderNotFoundException({
        idOrCode,
      })
    );
    const response = await apiTest
      .withAuthentication()
      .get(`/sales-order/${idOrCode}`)
      .send();

    expect(SalesOrderEngine.prototype.findByIdOrCode).toHaveBeenCalledWith(
      idOrCode
    );
    expectRejection(response, new SalesOrderNotFoundException({ idOrCode }));
  });
});
