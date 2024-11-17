import { SupplierUpdateAttributes, SupplierAttributes } from "@app/common";
import { SupplierEngine } from "@app/core";
import {
  apiTest,
  checkStrayValues,
  injectStrayValues,
  validationRejection,
} from "~test/utils";

describe("Controller: updateSupplierController", () => {
  it("should require authentication", async () => {
    await apiTest.testRequireAuthentication().put("/supplier/mock-id");
  });
  it("should call supplier facade update function", async () => {
    const id = "mock-id";
    const payload: SupplierUpdateAttributes = {
      name: "Supplier 1",
      status: "draft",
      address: "Address",
      email: "email@example.com",
      phone: "+62123123123",
      remarks: "remarks",
    };
    const supplier: SupplierAttributes = {
      id,
      createdAt: new Date(),
      updatedAt: new Date(),
      ...payload,
    } as SupplierAttributes;
    SupplierEngine.prototype.update = jest.fn().mockResolvedValueOnce(supplier);
    const response = await apiTest
      .withAuthentication()
      .put(`/supplier/${id}`)
      .send(injectStrayValues(payload));
    const { status, body } = response;
    expect(status).toStrictEqual(200);

    expect(SupplierEngine.prototype.update).toHaveBeenCalledWith(id, payload);
    expect(body.id).toStrictEqual(id);
    expect(body.name).toStrictEqual("Supplier 1");
    expect(body.email).toStrictEqual("email@example.com");
    expect(body.address).toStrictEqual("Address");
    expect(body.phone).toStrictEqual("+62123123123");
    expect(body.remarks).toStrictEqual("remarks");
    expect(body.status).toStrictEqual("draft");
    expect(body.createdAt).toBeDefined();
    expect(body.updatedAt).toBeDefined();
    expect(body.deletedAt).toBeUndefined();
    checkStrayValues(body);
  });

  it("should call supplier facade update function while even with empty payload", async () => {
    const id = "mock-id";
    const payload: SupplierUpdateAttributes = {};
    const supplier: SupplierAttributes = {
      id,
      name: "Supplier 1",
      address: "Address",
      email: "email@example.com",
      phone: "+62123123123",
      remarks: "remarks",
      status: "active",
      createdAt: new Date(),
      updatedAt: new Date(),
      ...payload,
    };
    SupplierEngine.prototype.update = jest
      .fn()
      .mockResolvedValueOnce(injectStrayValues(supplier));
    const response = await apiTest
      .withAuthentication()
      .put(`/supplier/${id}`)
      .send(injectStrayValues(payload));
    const { body, status } = response;
    expect(status).toStrictEqual(200);

    expect(SupplierEngine.prototype.update).toHaveBeenCalledWith(id, {});
    expect(body.id).toStrictEqual(id);
    expect(body.name).toStrictEqual("Supplier 1");
    expect(body.email).toStrictEqual("email@example.com");
    expect(body.address).toStrictEqual("Address");
    expect(body.phone).toStrictEqual("+62123123123");
    expect(body.remarks).toStrictEqual("remarks");
    expect(body.status).toStrictEqual("active");
    expect(body.createdAt).toBeDefined();
    expect(body.updatedAt).toBeDefined();
    expect(body.deletedAt).toBeUndefined();
    checkStrayValues(body);
  });

  it("should only accept correct data type", async () => {
    const response = await apiTest
      .withAuthentication()
      .put("/supplier/id")
      .send(
        injectStrayValues({
          name: 125258284,
          email: true,
          address: 123,
          phone: true,
          remarks: true,
          identity: true,
        })
      );
    validationRejection(response, [
      {
        type: "invalidType",
        key: "body.name",
        expected: "string",
        actual: "number",
        value: 125258284,
      },
      {
        type: "invalidType",
        key: "body.email",
        expected: "string",
        actual: "boolean",
        value: true,
      },
      {
        type: "invalidType",
        key: "body.address",
        expected: "string",
        actual: "number",
        value: 123,
      },
      {
        type: "invalidType",
        key: "body.phone",
        expected: "string",
        actual: "boolean",
        value: true,
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
        key: "body.identity",
        expected: "string",
        actual: "boolean",
        value: true,
      },
    ]);
  });
});
