import { SupplierCreationAttributes, SupplierAttributes } from "@app/common";
import { SupplierEngine } from "@app/core";
import {
  apiTest,
  checkStrayValues,
  injectStrayValues,
  validationRejection,
} from "~test/utils";

describe("Controller: createSupplierController", () => {
  it("should require authentication", async () => {
    await apiTest.testRequireAuthentication().post("/supplier");
  });
  it("should call supplier facade create function with required parameters", async () => {
    const id = "mock-id";
    const payload: SupplierCreationAttributes = {
      name: "Supplier 1",
    };
    const supplier: SupplierAttributes = {
      id,
      status: "active",
      createdAt: new Date(),
      updatedAt: new Date(),
      ...payload,
    };
    SupplierEngine.prototype.create = jest
      .fn()
      .mockResolvedValueOnce(injectStrayValues(supplier));
    const response = await apiTest
      .withAuthentication()
      .post("/supplier")
      .send(injectStrayValues(payload));
    expect(response.status).toStrictEqual(200);
    expect(SupplierEngine.prototype.create).toHaveBeenCalledWith({
      // ensure filtering of stray values
      ...payload,
    });
    const { body } = response;
    expect(body.id).toStrictEqual(id);
    expect(body.name).toStrictEqual("Supplier 1");
    expect(body.email).toBeUndefined();
    expect(body.address).toBeUndefined();
    expect(body.phone).toBeUndefined();
    expect(body.remarks).toBeUndefined();
    expect(body.createdAt).toBeDefined();
    expect(body.updatedAt).toBeDefined();
    expect(body.status).toStrictEqual("active");
    expect(body.deletedAt).toBeUndefined();

    checkStrayValues(body);
  });

  it("should call supplier facade create function while passing optional parameter as well", async () => {
    const id = "mock-id";
    const payload: SupplierCreationAttributes = {
      name: "Supplier 1",
      status: "draft",
      address: "Address",
      email: "email@email.com",
      phone: "+62123123123",
      remarks: "remarks",
      identity: "3273372332733273",
    };
    const supplier: SupplierAttributes = {
      id,
      createdAt: new Date(),
      updatedAt: new Date(),
      status: "draft",
      ...payload,
    };
    (SupplierEngine.prototype.create as jest.Mock).mockResolvedValueOnce(
      injectStrayValues(supplier)
    );
    const response = await apiTest
      .withAuthentication()
      .post("/supplier")
      .send(injectStrayValues(payload));

    expect(response.status).toStrictEqual(200);
    expect(SupplierEngine.prototype.create).toHaveBeenCalledWith(payload);
    const { body } = response;
    expect(body.id).toStrictEqual(id);
    expect(body.email).toStrictEqual("email@email.com");
    expect(body.address).toStrictEqual("Address");
    expect(body.phone).toStrictEqual("+62123123123");
    expect(body.remarks).toStrictEqual("remarks");
    expect(body.identity).toStrictEqual("3273372332733273");
    expect(body.createdAt).toBeDefined();
    expect(body.updatedAt).toBeDefined();
    expect(body.status).toStrictEqual("draft");
    expect(body.deletedAt).toBeUndefined();
    checkStrayValues(body);
  });

  it("should require name and code", async () => {
    const response = await apiTest.withAuthentication().post("/supplier").send({
      // ensure the filtering of stray values
      strayValue1: "stray value 1",
      handsomeValue: 123456,
    });
    validationRejection(response, [
      {
        type: "required",
        key: "body.name",
      },
    ]);
  });

  it("should only accept correct data type", async () => {
    const response = await apiTest
      .withAuthentication()
      .post("/supplier")
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
