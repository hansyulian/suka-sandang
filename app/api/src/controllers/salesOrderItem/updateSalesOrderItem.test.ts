import {
  SalesOrderItemUpdateAttributes,
  SalesOrderItemAttributes,
} from "@app/common";
import { SalesOrderItemEngine } from "@app/core";
import {
  apiTest,
  checkStrayValues,
  injectStrayValues,
  validationRejection,
} from "~test/utils";

describe("Controller: updateSalesOrderItemController", () => {
  it("should require authentication", async () => {
    await apiTest.testRequireAuthentication().put("/sales-order-item/mock-id");
  });
  it("should call SalesOrderItem facade update function", async () => {
    const id = "mock-id";
    const now = new Date();
    const payload: SalesOrderItemUpdateAttributes = {
      materialId: "material-id",
      quantity: 10,
      unitPrice: 1000,
      remarks: "Updated remarks",
    };
    const SalesOrderItem: SalesOrderItemAttributes = {
      id,
      salesOrderId: "sales-order-id",
      createdAt: now,
      updatedAt: now,
      remarks: "",
      subTotal: 10000,
      ...payload,
    } as SalesOrderItemAttributes;
    SalesOrderItemEngine.prototype.update = jest
      .fn()
      .mockResolvedValueOnce(injectStrayValues(SalesOrderItem));
    const response = await apiTest
      .withAuthentication()
      .put(`/sales-order-item/${id}`)
      .send(injectStrayValues(payload));
    const { status, body } = response;
    expect(status).toStrictEqual(200);

    expect(SalesOrderItemEngine.prototype.update).toHaveBeenCalledWith(id, {
      ...payload,
    });
    expect(body.id).toStrictEqual(id);
    expect(body.materialId).toStrictEqual("material-id");
    expect(body.remarks).toStrictEqual("Updated remarks");
    expect(body.salesOrderId).toStrictEqual("sales-order-id");
    expect(body.quantity).toStrictEqual(10);
    expect(body.unitPrice).toStrictEqual(1000);
    expect(body.subTotal).toStrictEqual(10000);
    expect(body.createdAt).toBeDefined();
    expect(body.updatedAt).toBeDefined();
    checkStrayValues(body);
  });

  it("should call SalesOrderItem facade update function while even with empty payload", async () => {
    const id = "mock-id";
    const now = new Date();
    const payload: SalesOrderItemUpdateAttributes = {};
    const SalesOrderItem: SalesOrderItemAttributes = {
      id,
      createdAt: now,
      updatedAt: now,
      remarks: "Original remarks",
      salesOrderId: "sales-order-id",
      subTotal: 10000,
      materialId: "original-material-id",
      quantity: 10,
      unitPrice: 1000,
      ...payload,
    } as SalesOrderItemAttributes;
    SalesOrderItemEngine.prototype.update = jest
      .fn()
      .mockResolvedValueOnce(injectStrayValues(SalesOrderItem));
    const response = await apiTest
      .withAuthentication()
      .put(`/sales-order-item/${id}`)
      .send(injectStrayValues(payload));
    const { body, status } = response;
    expect(status).toStrictEqual(200);

    expect(SalesOrderItemEngine.prototype.update).toHaveBeenCalledWith(id, {});
    expect(body.id).toStrictEqual(id);
    expect(body.materialId).toStrictEqual("original-material-id");
    expect(body.remarks).toStrictEqual("Original remarks");
    expect(body.salesOrderId).toStrictEqual("sales-order-id");
    expect(body.quantity).toStrictEqual(10);
    expect(body.unitPrice).toStrictEqual(1000);
    expect(body.subTotal).toStrictEqual(10000);
    expect(body.createdAt).toBeDefined();
    expect(body.updatedAt).toBeDefined();
    checkStrayValues(body);
  });

  it("should only accept correct data type", async () => {
    const response = await apiTest
      .withAuthentication()
      .put("/sales-order-item/mock-id")
      .send(
        injectStrayValues({
          materialId: true,
          quantity: "5",
          unitPrice: "100",
          remarks: false,
        })
      );
    validationRejection(response, [
      {
        type: "invalidType",
        key: "body.materialId",
        expected: "string",
        actual: "boolean",
        value: true,
      },
      {
        type: "invalidType",
        key: "body.quantity",
        expected: "number",
        actual: "string",
        value: "5",
      },
      {
        type: "invalidType",
        key: "body.unitPrice",
        expected: "number",
        actual: "string",
        value: "100",
      },
      {
        type: "invalidType",
        key: "body.remarks",
        expected: "string",
        actual: "boolean",
        value: false,
      },
    ]);
  });
});