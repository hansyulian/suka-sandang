import { SalesOrderEngine } from "@app/core";
import { extractQueryParameters } from "~/utils/extractQueryParemeters";
import { generateStringLikeQuery } from "~/utils/generateStringLikeQuery";
import { apiTest, checkStrayValues, injectStrayValues } from "~test/utils";

describe("Controller: listSalesOrdersController", () => {
  it("should require authentication", async () => {
    await apiTest.testRequireAuthentication().get("/sales-order");
  });
  it("should call SalesOrder facade list function", async () => {
    const id = "mock-id";
    const now = new Date();
    SalesOrderEngine.prototype.list = jest.fn().mockResolvedValueOnce(
      injectStrayValues({
        records: [
          injectStrayValues({
            id: id,
            code: "sample-sales-order-1",
            date: now,
            customerId: "mock-customer-id",
            createdAt: now,
            status: "draft",
            updatedAt: now,
            salesOrderItems: [
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
          }),
        ],
        count: 1,
      })
    );
    const response = await apiTest
      .withAuthentication()
      .get(`/sales-order`)
      .send();

    expect(SalesOrderEngine.prototype.list).toHaveBeenCalledWith(
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
    expect(firstRecord.code).toStrictEqual("sample-sales-order-1");
    expect(firstRecord.customerId).toStrictEqual("mock-customer-id");
    expect(firstRecord.date).toStrictEqual(now.toISOString());
    expect(firstRecord.status).toStrictEqual("draft");
    expect(firstRecord.createdAt).toBeDefined();
    expect(firstRecord.updatedAt).toBeDefined();
    expect(firstRecord.deletedAt).toBeUndefined();
    expect(firstRecord.customer).toBeDefined();
    expect(firstRecord.salesOrderItems).toBeUndefined();
    const customer = firstRecord.customer;
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
  });
  it("should handle queries", async () => {
    const id = "mock-id";
    const now = new Date();
    SalesOrderEngine.prototype.list = jest.fn().mockResolvedValueOnce({
      records: [
        {
          id: id,
          code: "sample-sales-order-1",
          date: now,
          customerId: "mock-customer-id",
          createdAt: now,
          status: "draft",
          updatedAt: now,
        },
      ],
      count: 1,
    });
    const query = {
      code: "sample-sales-order",
    };
    const response = await apiTest
      .withAuthentication()
      .get(`/sales-order`)
      .query(injectStrayValues(query))
      .send();

    expect(SalesOrderEngine.prototype.list).toHaveBeenCalledWith(
      generateStringLikeQuery(query),
      extractQueryParameters({})
    );
    const { body } = response;
    expect(body.info).toEqual({ count: 1 });
    expect(body.records.length).toStrictEqual(1);
    const firstRecord = body.records[0];
    expect(firstRecord.id).toStrictEqual(id);
    expect(firstRecord.code).toStrictEqual("sample-sales-order-1");
    expect(firstRecord.customerId).toStrictEqual("mock-customer-id");
    expect(firstRecord.date).toStrictEqual(now.toISOString());
    expect(firstRecord.status).toStrictEqual("draft");
    expect(firstRecord.createdAt).toBeDefined();
    expect(firstRecord.updatedAt).toBeDefined();
    expect(firstRecord.deletedAt).toBeUndefined();
  });
  it("should handle search query", async () => {
    const id = "mock-id";
    const now = new Date();
    SalesOrderEngine.prototype.list = jest.fn().mockResolvedValueOnce({
      records: [
        {
          id: id,
          code: "sample-sales-order-1",
          date: now,
          customerId: "mock-customer-id",
          createdAt: now,
          status: "draft",
          updatedAt: now,
        },
      ],
      count: 1,
    });
    const query = {
      search: "sample-sales-order",
    };
    const response = await apiTest
      .withAuthentication()
      .get(`/sales-order`)
      .query(injectStrayValues(query))
      .send();

    expect(SalesOrderEngine.prototype.list).toHaveBeenCalledWith(
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
    expect(firstRecord.code).toStrictEqual("sample-sales-order-1");
    expect(firstRecord.customerId).toStrictEqual("mock-customer-id");
    expect(firstRecord.date).toStrictEqual(now.toISOString());
    expect(firstRecord.status).toStrictEqual("draft");
    expect(firstRecord.createdAt).toBeDefined();
    expect(firstRecord.updatedAt).toBeDefined();
    expect(firstRecord.deletedAt).toBeUndefined();
  });
});
