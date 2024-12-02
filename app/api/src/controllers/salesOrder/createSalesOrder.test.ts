import {
  SalesOrderCreationAttributes,
  SalesOrderAttributes,
} from "@app/common";
import { SalesOrderEngine } from "@app/core";
import {
  apiTest,
  checkStrayValues,
  injectStrayValues,
  validationRejection,
} from "~test/utils";

describe("Controller: createSalesOrderController", () => {
  it("should require authentication", async () => {
    await apiTest.testRequireAuthentication().post("/sales-order");
  });
  it("should call SalesOrder facade create function with required parameters", async () => {
    const id = "mock-id";
    const now = new Date();
    const payload: SalesOrderCreationAttributes = {
      code: "sample-sales-order-1",
      date: now,
      customerId: "mock-customer-id",
    };
    const salesOrder: SalesOrderAttributes = {
      id,
      createdAt: now,
      updatedAt: now,
      status: "draft",
      total: 0,
      remarks: "",
      ...payload,
    };
    SalesOrderEngine.prototype.create = jest
      .fn()
      .mockResolvedValueOnce(injectStrayValues(salesOrder));
    const response = await apiTest
      .withAuthentication()
      .post("/sales-order")
      .send(injectStrayValues(payload));
    expect(response.status).toStrictEqual(200);
    expect(SalesOrderEngine.prototype.create).toHaveBeenCalledWith({
      ...payload,
      date: now,
      items: undefined,
      remarks: undefined,
      status: undefined,
    });
    const { body } = response;
    expect(body.id).toStrictEqual(id);
    expect(body.code).toStrictEqual("sample-sales-order-1");
    expect(body.remarks).toStrictEqual("");
    expect(body.customerId).toStrictEqual("mock-customer-id");
    expect(body.createdAt).toBeDefined();
    expect(body.updatedAt).toBeDefined();
    expect(body.status).toStrictEqual("draft");
    expect(body.deletedAt).toBeUndefined();

    checkStrayValues(body);
  });

  it("should call SalesOrder facade create function while passing optional parameter as well", async () => {
    const id = "mock-id";
    const payload = {
      code: "sample-sales-order-1",
      date: new Date(),
      customerId: "mock-customer-id",
      remarks: "Sample remarks",
      items: undefined,
    };
    const SalesOrder = {
      id,
      createdAt: new Date(),
      updatedAt: new Date(),
      status: "draft",
      total: 0,
      ...payload,
    };
    (SalesOrderEngine.prototype.create as jest.Mock).mockResolvedValueOnce(
      injectStrayValues(SalesOrder)
    );
    const response = await apiTest
      .withAuthentication()
      .post("/sales-order")
      .send(injectStrayValues(payload));

    expect(response.status).toStrictEqual(200);
    expect(SalesOrderEngine.prototype.create).toHaveBeenCalledWith(payload);
    const { body } = response;
    expect(body.id).toStrictEqual(id);
    expect(body.code).toStrictEqual("sample-sales-order-1");
    expect(body.remarks).toStrictEqual("Sample remarks");
    expect(body.customerId).toStrictEqual("mock-customer-id");
    expect(body.createdAt).toBeDefined();
    expect(body.updatedAt).toBeDefined();
    expect(body.status).toStrictEqual("draft");
    expect(body.deletedAt).toBeUndefined();
    checkStrayValues(body);
  });

  it("should require code, date, and customer id", async () => {
    const response = await apiTest
      .withAuthentication()
      .post("/sales-order")
      .send({
        // ensure the filtering of stray values
        strayValue1: "stray value 1",
        handsomeValue: 123456,
      });
    validationRejection(response, [
      {
        type: "required",
        key: "body.date",
      },
      {
        type: "required",
        key: "body.customerId",
      },
      {
        type: "required",
        key: "body.code",
      },
    ]);
  });

  it("should only accept correct data type", async () => {
    const response = await apiTest
      .withAuthentication()
      .post("/sales-order")
      .send(
        injectStrayValues({
          code: true,
          customerId: 123,
          date: "invalid date",
          remarks: true,
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
        key: "body.customerId",
        expected: "string",
        actual: "number",
        value: 123,
      },
      {
        type: "invalidType",
        key: "body.remarks",
        expected: "string",
        actual: "boolean",
        value: true,
      },
      {
        type: "invalidType",
        key: "body.code",
        expected: "string",
        actual: "boolean",
        value: true,
      },
    ]);
  });
});
