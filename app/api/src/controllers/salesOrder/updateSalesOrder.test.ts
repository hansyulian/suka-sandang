import {
  SalesOrderUpdateAttributes,
  SalesOrderAttributes,
  salesOrderStatus,
} from "@app/common";
import { SalesOrderEngine } from "@app/core";
import {
  apiTest,
  checkStrayValues,
  injectStrayValues,
  validationRejection,
} from "~test/utils";

describe("Controller: updateSalesOrderController", () => {
  it("should require authentication", async () => {
    await apiTest.testRequireAuthentication().put("/sales-order/mock-id");
  });
  it("should call SalesOrder facade update function", async () => {
    const id = "mock-id";
    const now = new Date();
    const payload: SalesOrderUpdateAttributes = {
      date: now,
      remarks: "Updated remarks",
      status: "processing",
    };
    const SalesOrder: SalesOrderAttributes = {
      id,
      code: "sample-sales-order-1",
      customerId: "customer-id-1",
      total: 5000,
      createdAt: new Date(),
      updatedAt: new Date(),
      ...payload,
    } as SalesOrderAttributes;
    SalesOrderEngine.prototype.update = jest
      .fn()
      .mockResolvedValueOnce(injectStrayValues(SalesOrder));
    const response = await apiTest
      .withAuthentication()
      .put(`/sales-order/${id}`)
      .send(injectStrayValues(payload));
    const { status, body } = response;
    expect(status).toStrictEqual(200);

    expect(SalesOrderEngine.prototype.update).toHaveBeenCalledWith(id, {
      ...payload,
      date: now,
      items: undefined,
    });
    expect(body.id).toStrictEqual(id);
    expect(body.code).toStrictEqual("sample-sales-order-1");
    expect(body.customerId).toStrictEqual("customer-id-1");
    expect(body.total).toStrictEqual(5000);
    expect(body.remarks).toStrictEqual("Updated remarks"),
      expect(body.createdAt).toBeDefined();
    expect(body.updatedAt).toBeDefined();
    expect(body.status).toStrictEqual("processing");
    expect(body.deletedAt).toBeUndefined();
    checkStrayValues(body);
  });

  it("should call SalesOrder facade update function while even with empty payload", async () => {
    const id = "mock-id";
    const payload: SalesOrderUpdateAttributes = {};
    const SalesOrder: SalesOrderAttributes = {
      id,
      code: "sample-sales-order-1",
      customerId: "customer-id-1",
      total: 5000,
      createdAt: new Date(),
      updatedAt: new Date(),
      status: "draft",
      remarks: "empty remarks",
      ...payload,
    } as SalesOrderAttributes;
    SalesOrderEngine.prototype.update = jest
      .fn()
      .mockResolvedValueOnce(injectStrayValues(SalesOrder));
    const response = await apiTest
      .withAuthentication()
      .put(`/sales-order/${id}`)
      .send(injectStrayValues(payload));
    const { body, status } = response;
    expect(status).toStrictEqual(200);

    expect(SalesOrderEngine.prototype.update).toHaveBeenCalledWith(id, {});
    expect(body.id).toStrictEqual(id);
    expect(body.code).toStrictEqual("sample-sales-order-1");
    expect(body.customerId).toStrictEqual("customer-id-1");
    expect(body.remarks).toStrictEqual("empty remarks"),
      expect(body.total).toStrictEqual(5000);
    expect(body.createdAt).toBeDefined();
    expect(body.updatedAt).toBeDefined();
    expect(body.status).toStrictEqual("draft");
    expect(body.deletedAt).toBeUndefined();
    checkStrayValues(body);
  });

  it("should only accept correct data type", async () => {
    const response = await apiTest
      .withAuthentication()
      .put("/sales-order/mock-id")
      .send(
        injectStrayValues({
          date: "invalid date",
          remarks: true,
          status: "invalid",
        })
      );
    validationRejection(response, [
      {
        type: "invalidType",
        key: "body.date",
        expected: "date",
        actual: "string",
        value: "invalid date",
      },
      {
        type: "invalidType",
        key: "body.remarks",
        expected: "string",
        actual: "boolean",
        value: true,
      },
      {
        type: "invalidValue",
        key: "body.status",
        value: "invalid",
        expected: salesOrderStatus,
      },
    ]);
  });
});
