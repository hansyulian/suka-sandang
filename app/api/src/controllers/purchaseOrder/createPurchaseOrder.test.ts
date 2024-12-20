import {
  PurchaseOrderCreationAttributes,
  PurchaseOrderAttributes,
} from "@app/common";
import { PurchaseOrderEngine } from "@app/core";
import {
  apiTest,
  checkStrayValues,
  injectStrayValues,
  validationRejection,
} from "~test/utils";

describe("Controller: createPurchaseOrderController", () => {
  it("should require authentication", async () => {
    await apiTest.testRequireAuthentication().post("/purchase-order");
  });
  it("should call PurchaseOrder facade create function with required parameters", async () => {
    const id = "mock-id";
    const now = new Date();
    const payload: PurchaseOrderCreationAttributes = {
      code: "sample-purchase-order-1",
      date: now,
      supplierId: "mock-supplier-id",
    };
    const purchaseOrder: PurchaseOrderAttributes = {
      id,
      createdAt: now,
      updatedAt: now,
      status: "draft",
      total: 0,
      remarks: "",
      ...payload,
    };
    PurchaseOrderEngine.prototype.create = jest
      .fn()
      .mockResolvedValueOnce(injectStrayValues(purchaseOrder));
    const response = await apiTest
      .withAuthentication()
      .post("/purchase-order")
      .send(injectStrayValues(payload));
    expect(response.status).toStrictEqual(200);
    expect(PurchaseOrderEngine.prototype.create).toHaveBeenCalledWith({
      ...payload,
      date: now,
      items: undefined,
      remarks: undefined,
      status: undefined,
    });
    const { body } = response;
    expect(body.id).toStrictEqual(id);
    expect(body.code).toStrictEqual("sample-purchase-order-1");
    expect(body.remarks).toStrictEqual("");
    expect(body.supplierId).toStrictEqual("mock-supplier-id");
    expect(body.createdAt).toBeDefined();
    expect(body.updatedAt).toBeDefined();
    expect(body.status).toStrictEqual("draft");
    expect(body.deletedAt).toBeUndefined();

    checkStrayValues(body);
  });

  it("should call PurchaseOrder facade create function while passing optional parameter as well", async () => {
    const id = "mock-id";
    const payload = {
      code: "sample-purchase-order-1",
      date: new Date(),
      supplierId: "mock-supplier-id",
      remarks: "Sample remarks",
      items: undefined,
    };
    const PurchaseOrder = {
      id,
      createdAt: new Date(),
      updatedAt: new Date(),
      status: "draft",
      total: 0,
      ...payload,
    };
    (PurchaseOrderEngine.prototype.create as jest.Mock).mockResolvedValueOnce(
      injectStrayValues(PurchaseOrder)
    );
    const response = await apiTest
      .withAuthentication()
      .post("/purchase-order")
      .send(injectStrayValues(payload));

    expect(response.status).toStrictEqual(200);
    expect(PurchaseOrderEngine.prototype.create).toHaveBeenCalledWith(payload);
    const { body } = response;
    expect(body.id).toStrictEqual(id);
    expect(body.code).toStrictEqual("sample-purchase-order-1");
    expect(body.remarks).toStrictEqual("Sample remarks");
    expect(body.supplierId).toStrictEqual("mock-supplier-id");
    expect(body.createdAt).toBeDefined();
    expect(body.updatedAt).toBeDefined();
    expect(body.status).toStrictEqual("draft");
    expect(body.deletedAt).toBeUndefined();
    checkStrayValues(body);
  });

  it("should require code, date, and supplier id", async () => {
    const response = await apiTest
      .withAuthentication()
      .post("/purchase-order")
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
        key: "body.supplierId",
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
      .post("/purchase-order")
      .send(
        injectStrayValues({
          code: true,
          supplierId: 123,
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
        key: "body.supplierId",
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
