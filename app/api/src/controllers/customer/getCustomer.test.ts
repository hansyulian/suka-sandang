import { CustomerAttributes } from "@app/common";
import { CustomerFacade, CustomerNotFoundException } from "@app/engine";
import { apiTest } from "~test/utils";
import { expectRejection } from "~test/utils/expectRejection";

describe("Controller: getCustomerController", () => {
  it("should require authentication", async () => {
    await apiTest.testRequireAuthentication().get("/customer/mock-id");
  });
  it("should call customer facade get function", async () => {
    const id = "mock-id";
    const record: CustomerAttributes = {
      id,
      name: "Customer 1",
      address: "Address",
      email: "email@example.com",
      phone: "+62123123123",
      remarks: "remarks",
      identity: "3273",
      createdAt: new Date(),
      status: "active",
      updatedAt: new Date(),
    };
    CustomerFacade.prototype.findById = jest.fn().mockResolvedValueOnce(record);
    const response = await apiTest
      .withAuthentication()
      .get(`/customer/${id}`)
      .send();

    expect(CustomerFacade.prototype.findById).toHaveBeenCalledWith(id);
    const { body } = response;
    expect(body.id).toStrictEqual(id);
    expect(body.name).toStrictEqual("Customer 1");
    expect(body.email).toStrictEqual("email@example.com");
    expect(body.address).toStrictEqual("Address");
    expect(body.phone).toStrictEqual("+62123123123");
    expect(body.remarks).toStrictEqual("remarks");
    expect(body.status).toStrictEqual("active");
    expect(body.identity).toStrictEqual("3273");
    expect(body.createdAt).toBeDefined();
    expect(body.updatedAt).toBeDefined();
    expect(body.deletedAt).toBeUndefined();
  });
  it("should handle not found exception if id not found", async () => {
    const id = "mock-id";
    CustomerFacade.prototype.findById = jest.fn().mockRejectedValueOnce(
      new CustomerNotFoundException({
        id,
      })
    );
    const response = await apiTest
      .withAuthentication()
      .get(`/customer/${id}`)
      .send();

    expect(CustomerFacade.prototype.findById).toHaveBeenCalledWith(id);
    expectRejection(response, new CustomerNotFoundException({ id }));
  });
});
