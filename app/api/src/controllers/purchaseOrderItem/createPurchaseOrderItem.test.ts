import {
  PurchaseOrderItemCreationAttributes,
  PurchaseOrderItemAttributes,
} from "@app/common";
import { PurchaseOrderItemEngine } from "@app/core";
import { dateStringUtil } from "@hyulian/api-contract";
import {
  apiTest,
  checkStrayValues,
  injectStrayValues,
  validationRejection,
} from "~test/utils";

describe("Controller: createPurchaseOrderItemController", () => {
  it("should require authentication", async () => {
    await apiTest.testRequireAuthentication().post("/purchase-order-item");
  });
  it("should call PurchaseOrderItem facade create function with required parameters", async () => {
    const id = "mock-id";
    const now = new Date();
    const payload: PurchaseOrderItemCreationAttributes = {
      materialId: "material-id",
      purchaseOrderId: "purchase-order-id",
      quantity: 5,
      unitPrice: 100,
      remarks: "Sample remarks",
    };
    const purchaseOrderItem: PurchaseOrderItemAttributes = {
      id,
      createdAt: now,
      updatedAt: now,
      remarks: "",
      subTotal: 500,
      ...payload,
    };
    PurchaseOrderItemEngine.prototype.create = jest
      .fn()
      .mockResolvedValueOnce(injectStrayValues(purchaseOrderItem));
    const response = await apiTest
      .withAuthentication()
      .post("/purchase-order-item")
      .send(injectStrayValues(payload));
    expect(response.status).toStrictEqual(200);
    expect(PurchaseOrderItemEngine.prototype.create).toHaveBeenCalledWith({
      ...payload,
      remarks: "Sample remarks",
    });
    const { body } = response;
    expect(body.id).toStrictEqual(id);
    expect(body.materialId).toStrictEqual("material-id");
    expect(body.remarks).toStrictEqual("Sample remarks");
    expect(body.purchaseOrderId).toStrictEqual("purchase-order-id");
    expect(body.quantity).toStrictEqual(5);
    expect(body.unitPrice).toStrictEqual(100);
    expect(body.subTotal).toStrictEqual(500);
    expect(body.createdAt).toBeDefined();
    expect(body.updatedAt).toBeDefined();

    checkStrayValues(body);
  });

  it("should call PurchaseOrderItem facade create function while passing optional parameter as well", async () => {
    const id = "mock-id";
    const now = new Date();
    const payload: PurchaseOrderItemCreationAttributes = {
      materialId: "material-id",
      purchaseOrderId: "purchase-order-id",
      quantity: 5,
      unitPrice: 100,
    };
    const PurchaseOrderItem: PurchaseOrderItemAttributes = {
      id,
      createdAt: now,
      updatedAt: now,
      remarks: "",
      subTotal: 500,
      ...payload,
    };
    (
      PurchaseOrderItemEngine.prototype.create as jest.Mock
    ).mockResolvedValueOnce(injectStrayValues(PurchaseOrderItem));
    const response = await apiTest
      .withAuthentication()
      .post("/purchase-order-item")
      .send(injectStrayValues(payload));

    expect(response.status).toStrictEqual(200);
    expect(PurchaseOrderItemEngine.prototype.create).toHaveBeenCalledWith(
      payload
    );
    const { body } = response;
    expect(body.id).toStrictEqual(id);
    expect(body.materialId).toStrictEqual("material-id");
    expect(body.remarks).toStrictEqual("");
    expect(body.purchaseOrderId).toStrictEqual("purchase-order-id");
    expect(body.quantity).toStrictEqual(5);
    expect(body.unitPrice).toStrictEqual(100);
    expect(body.subTotal).toStrictEqual(500);
    expect(body.createdAt).toBeDefined();
    expect(body.updatedAt).toBeDefined();
    checkStrayValues(body);
  });

  it("should check required fields", async () => {
    const response = await apiTest
      .withAuthentication()
      .post("/purchase-order-item")
      .send({
        // ensure the filtering of stray values
        strayValue1: "stray value 1",
        handsomeValue: 123456,
      });
    validationRejection(response, [
      {
        type: "required",
        key: "body.materialId",
      },
      {
        type: "required",
        key: "body.purchaseOrderId",
      },
      {
        type: "required",
        key: "body.quantity",
      },
      {
        type: "required",
        key: "body.unitPrice",
      },
    ]);
  });

  it("should only accept correct data type", async () => {
    const response = await apiTest
      .withAuthentication()
      .post("/purchase-order-item")
      .send(
        injectStrayValues({
          materialId: true,
          purchaseOrderId: true,
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
        key: "body.purchaseOrderId",
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
