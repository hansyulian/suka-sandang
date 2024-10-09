import { CustomerUpdateAttributes, CustomerAttributes } from "@app/common";
import { CustomerFacade } from "@app/engine";
import {
  apiTest,
  checkStrayValues,
  injectStrayValues,
  validationRejection,
} from "~test/utils";

describe("Controller: updateCustomerController", () => {
  it("should require authentication", async () => {
    await apiTest.testRequireAuthentication().put("/customer/mock-id");
  });
  it("should call customer facade update function", async () => {
    const id = "mock-id";
    const payload: CustomerUpdateAttributes = {
      name: "Customer 1",
      status: "draft",
      address: "Address",
      email: "email@example.com",
      phone: "+62123123123",
      remarks: "remarks",
    };
    const customer: CustomerAttributes = {
      id,
      createdAt: new Date(),
      updatedAt: new Date(),
      ...payload,
    } as CustomerAttributes;
    CustomerFacade.prototype.update = jest.fn().mockResolvedValueOnce(customer);
    const response = await apiTest
      .withAuthentication()
      .put(`/customer/${id}`)
      .send(injectStrayValues(payload));
    const { status, body } = response;
    expect(status).toStrictEqual(200);

    expect(CustomerFacade.prototype.update).toHaveBeenCalledWith(id, payload);
    expect(body.id).toStrictEqual(id);
    expect(body.name).toStrictEqual("Customer 1");
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

  it("should call customer facade update function while even with empty payload", async () => {
    const id = "mock-id";
    const payload: CustomerUpdateAttributes = {};
    const customer: CustomerAttributes = {
      id,
      name: "Customer 1",
      address: "Address",
      email: "email@example.com",
      phone: "+62123123123",
      remarks: "remarks",
      status: "active",
      createdAt: new Date(),
      updatedAt: new Date(),
      ...payload,
    };
    CustomerFacade.prototype.update = jest
      .fn()
      .mockResolvedValueOnce(injectStrayValues(customer));
    const response = await apiTest
      .withAuthentication()
      .put(`/customer/${id}`)
      .send(injectStrayValues(payload));
    const { body, status } = response;
    expect(status).toStrictEqual(200);

    expect(CustomerFacade.prototype.update).toHaveBeenCalledWith(id, {});
    expect(body.id).toStrictEqual(id);
    expect(body.name).toStrictEqual("Customer 1");
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
      .post("/customer")
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
